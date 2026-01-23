import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ScrollText, Eye } from "lucide-react";
import { IdeaCauldron } from "@/components/IdeaCauldron";
import { PlatformBottle } from "@/components/PlatformBottle";
import { IngredientTag } from "@/components/IngredientTag";
import { BrewButton } from "@/components/BrewButton";
import { PotionRack } from "@/components/PotionRack";
import { PowerConfigModal } from "@/components/PowerConfigModal";
import { PowerUserConfig, defaultPowerUserConfig } from "@/types/config";
import { vibePresets, VibeConfig } from "@/components/VibePreset";
import { PromptPreviewModal } from "@/components/PromptPreviewModal";
import { toast } from "sonner";
import axios from "axios";
import { PlatformResult } from "@/types/content";
import { useDebounce } from "@/hooks/useDebounce";
import { contentApi } from "@/services/contentApi";

const platforms = ["Instagram", "TikTok", "X/Twitter", "LinkedIn", "Facebook", "Reddit"];

// ... Maps ...
const platformMap: Record<string, string> = {
    "Instagram": "instagram",
    "TikTok": "tiktok",
    "X/Twitter": "x",
    "LinkedIn": "linkedin",
    "Facebook": "facebook",
    "Reddit": "reddit"
};

const reversePlatformMap: Record<string, string> = {
    "instagram": "Instagram",
    "tiktok": "TikTok",
    "x": "X/Twitter",
    "linkedin": "LinkedIn",
    "facebook": "Facebook",
    "reddit": "Reddit"
};

const defaultVibeConfig: VibeConfig = {
    humanity: 70,
    friendliness: 70,
    provocative: 30,
    professionalism: 50,
    vulnerability: 40,
    opinionated: 50,
    honesty: 75,
    polished: 60,
    raw: 40,
};

export function CreatePage() {
    const [contentIdea, setContentIdea] = useState("");
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
    const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
    const [vibeConfig, setVibeConfig] = useState<VibeConfig>(defaultVibeConfig);
    // Per-platform power configs - each platform can have its own settings
    const [platformConfigs, setPlatformConfigs] = useState<Record<string, PowerUserConfig>>({});

    const [customizeModal, setCustomizeModal] = useState<string | null>(null);
    const [showPromptPreview, setShowPromptPreview] = useState(false);

    const [platformResults, setPlatformResults] = useState<Record<string, PlatformResult>>({});
    const [isGenerating, setIsGenerating] = useState(false);

    // Preference persistence state
    const [isLoaded, setIsLoaded] = useState(false);
    const baselineRef = useRef<string | null>(null);

    // Debounce values for auto-saving (1 second delay)
    const debouncedIdea = useDebounce(contentIdea, 1000);
    const debouncedPlatforms = useDebounce(selectedPlatforms, 1000);
    const debouncedConfigs = useDebounce(platformConfigs, 1000);

    // Load preferences on mount
    useEffect(() => {
        async function loadPreferences() {
            try {
                const prefs = await contentApi.getPreferences();
                if (prefs) {
                    if (prefs.last_idea_prompt) setContentIdea(prefs.last_idea_prompt);
                    if (prefs.last_platform_selection) {
                        const saved = JSON.parse(prefs.last_platform_selection);
                        // Filter out stale platforms
                        const valid = saved.filter((name: string) => platforms.includes(name));
                        setSelectedPlatforms(valid);
                    }
                    if (prefs.last_policies) {
                        setPlatformConfigs(JSON.parse(prefs.last_policies));
                    }
                }
            } catch (error) {
                console.error('Failed to load preferences:', error);
            } finally {
                setIsLoaded(true);
            }
        }
        loadPreferences();
    }, []);

    // Save preferences when changed (with baseline comparison to prevent race conditions)
    useEffect(() => {
        if (!isLoaded) return;

        // Create snapshot of current debounced values
        const currentSnapshot = JSON.stringify({
            idea: debouncedIdea,
            platforms: debouncedPlatforms,
            configs: debouncedConfigs,
        });

        // First run after load: establish baseline, don't save
        if (baselineRef.current === null) {
            baselineRef.current = currentSnapshot;
            return;
        }

        // If values unchanged from baseline, skip save
        if (currentSnapshot === baselineRef.current) {
            return;
        }

        // Values changed - update baseline and save
        baselineRef.current = currentSnapshot;

        const saveData = {
            last_idea_prompt: debouncedIdea,
            last_platform_selection: JSON.stringify(debouncedPlatforms),
            last_policies: JSON.stringify(debouncedConfigs),
        };

        contentApi.updatePreferences(saveData).catch(err =>
            console.error('Failed to save preferences:', err)
        );
    }, [debouncedIdea, debouncedPlatforms, debouncedConfigs, isLoaded]);

    const togglePlatform = (platform: string) => {
        setSelectedPlatforms((prev) =>
            prev.includes(platform)
                ? prev.filter((p) => p !== platform)
                : [...prev, platform]
        );
    };

    const handleVibeSelect = (vibeId: string) => {
        if (selectedVibe === vibeId) {
            setSelectedVibe(null);
            setVibeConfig(defaultVibeConfig);
        } else {
            setSelectedVibe(vibeId);
            const preset = vibePresets.find((v) => v.id === vibeId);
            if (preset) {
                setVibeConfig(preset.config);
            }
        }
    };

    const handleGenerate = async (specificPlatform?: string) => {
        const platformsToBrew = specificPlatform ? [specificPlatform] : selectedPlatforms;

        if (!contentIdea.trim()) {
            toast.error("Drop something in the cauldron first! 🧪");
            return;
        }
        if (platformsToBrew.length === 0) {
            toast.error("Pick at least one potion bottle! 🍾");
            return;
        }

        setIsGenerating(true);

        const apiPlatforms = platformsToBrew.map(p => platformMap[p]);
        const convertToApiPolicy = (config: PowerUserConfig) => ({
            authorPersona: config.persona,
            writingStyle: config.style,
            constraints: {
                targetChars: config.format.targetLength,
                hashtags: config.format.hashtags,
            },
            format: config.format,
            models: config.models,
        });

        // Build policy map - use platform-specific config or default
        const policyMap = apiPlatforms.reduce((acc, platform) => {
            const displayName = reversePlatformMap[platform];
            const config = platformConfigs[displayName] || defaultPowerUserConfig;
            return {
                ...acc,
                [platform]: convertToApiPolicy(config)
            };
        }, {});

        try {
            const response = await axios.post<{ results: PlatformResult[] }>('/content/generate', {
                idea_prompt: contentIdea,
                platforms: apiPlatforms,
                platform_policies: policyMap
            });

            const { results } = response.data;

            setPlatformResults(prev => {
                const newResults = { ...prev };
                results.forEach(result => {
                    // Update only if success or if it's an error for a specific platform we tried
                    // We always update to reflect the latest attempt (success or error)
                    const displayName = reversePlatformMap[result.platform];
                    if (displayName) {
                        newResults[displayName] = result;
                    }
                });
                return newResults;
            });

            const successCount = results.filter(r => r.success).length;
            if (successCount === results.length) {
                toast.success("Potions brewed successfully!");
            } else if (successCount > 0) {
                toast.warning(`Brewed ${successCount}/${results.length} potions. Some failed.`);
            } else {
                toast.error("Brewing failed for all selected potions.");
            }

        } catch (error) {
            console.error("Brewing failed:", error);
            toast.error("The cauldron bubbled over! (API Error)");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="animate-fade-in relative">
            {/* Navigation Controls - Top Right */}
            <div className="absolute top-6 right-6 z-50 flex items-center gap-3">
                <Link
                    to="/history"
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-card/60 backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 text-sm font-medium text-primary hover:text-primary/80 group"
                >
                    <ScrollText className="w-4 h-4" />
                    <span>History</span>
                </Link>
                <ThemeToggle />
            </div>

            {/* Hero Header */}
            <header className="relative pt-16 pb-12 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-card/60 backdrop-blur-sm border border-border mb-8 animate-fade-in">
                        <span className="text-2xl">🧪</span>
                        <span className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
                            Welcome to the Laboratory
                        </span>
                        <span className="text-2xl">✨</span>
                    </div>

                    <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 animate-fade-in leading-tight">
                        The{" "}
                        <span className="gradient-text">Alchemy</span>
                        {" "}Lab
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in leading-relaxed">
                        Transform your raw ideas into pure content gold.
                        <br className="hidden md:block" />
                        Pick your potions, add your essence, and let the magic begin.
                    </p>
                </div>
            </header>

            {/* Main Content */}
            <main className="px-6 pb-20">
                <div className="max-w-5xl mx-auto">
                    <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
                        {/* Left Column - Workbench */}
                        <div className="lg:col-span-3 space-y-10">
                            <section className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
                                <IdeaCauldron
                                    value={contentIdea}
                                    onChange={setContentIdea}
                                />
                            </section>

                            <section className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="text-2xl">🏷️</span>
                                    <div>
                                        <h2 className="font-display text-2xl font-semibold text-foreground">
                                            Ingredient Tags
                                        </h2>
                                        <p className="text-muted-foreground text-sm">
                                            Pick your writing essence
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-4 justify-start">
                                    {vibePresets.map((preset, index) => (
                                        <div
                                            key={preset.id}
                                            style={{
                                                transform: `rotate(${(index % 2 === 0 ? -1 : 1) * (1 + index * 0.5)}deg)`,
                                            }}
                                        >
                                            <IngredientTag
                                                preset={preset}
                                                selected={selectedVibe === preset.id}
                                                onSelect={() => handleVibeSelect(preset.id)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Right Column - Bottle Rack */}
                        <div className="lg:col-span-2 space-y-10">
                            <section className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
                                <div className="flex items-center gap-3 mb-5">
                                    <span className="text-2xl">🍾</span>
                                    <h2 className="font-display text-2xl font-semibold text-foreground">
                                        Potion Bottles
                                    </h2>
                                </div>
                                <p className="text-muted-foreground text-sm mb-5">
                                    Select the vessels for your content magic
                                </p>

                                <div className="grid grid-cols-3 gap-4">
                                    {platforms.map((platform) => (
                                        <PlatformBottle
                                            key={platform}
                                            platform={platform}
                                            selected={selectedPlatforms.includes(platform)}
                                            onToggle={() => togglePlatform(platform)}
                                            onCustomize={() => setCustomizeModal(platform)}
                                        />
                                    ))}
                                </div>
                            </section>

                            <section className="animate-slide-up pt-4" style={{ animationDelay: "0.4s" }}>
                                <div className="flex flex-col items-center gap-4">
                                    <BrewButton
                                        onClick={() => handleGenerate()}
                                        isLoading={isGenerating}
                                        disabled={!contentIdea.trim() || selectedPlatforms.length === 0}
                                    />

                                    <button
                                        onClick={() => setShowPromptPreview(true)}
                                        className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
                                    >
                                        <Eye className="w-4 h-4" />
                                        Peek at the spell
                                    </button>
                                </div>
                            </section>
                        </div>
                    </div>

                    {selectedPlatforms.length > 0 && (
                        <section className="mt-16 animate-slide-up" style={{ animationDelay: "0.5s" }}>
                            <PotionRack
                                platformResults={platformResults}
                                selectedPlatforms={selectedPlatforms}
                                isGenerating={isGenerating}
                                ideaPrompt={contentIdea}
                                onRetry={handleGenerate}
                            />
                        </section>
                    )}
                </div>
            </main>

            {/* Modals */}
            <PowerConfigModal
                open={!!customizeModal}
                onOpenChange={(open) => !open && setCustomizeModal(null)}
                platform={customizeModal || ""}
                config={customizeModal ? (platformConfigs[customizeModal] || defaultPowerUserConfig) : defaultPowerUserConfig}
                onConfigChange={(newConfig) => {
                    if (customizeModal) {
                        setPlatformConfigs(prev => ({
                            ...prev,
                            [customizeModal]: newConfig
                        }));
                    }
                }}
            />

            <PromptPreviewModal
                open={showPromptPreview}
                onOpenChange={setShowPromptPreview}
                contentIdea={contentIdea}
                selectedPlatforms={selectedPlatforms.map(p => platformMap[p])}
                platformPolicies={selectedPlatforms.reduce((acc, displayName) => {
                    const apiPlatform = platformMap[displayName];
                    const config = platformConfigs[displayName] || defaultPowerUserConfig;
                    return {
                        ...acc,
                        [apiPlatform]: {
                            authorPersona: config.persona,
                            writingStyle: config.style,
                            constraints: {
                                targetChars: config.format.targetLength,
                                hashtags: config.format.hashtags,
                            },
                            format: config.format,
                            models: config.models,
                        }
                    };
                }, {})}
            />
        </div>
    );
}
