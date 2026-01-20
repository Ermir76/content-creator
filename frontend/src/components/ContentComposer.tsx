import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Briefcase, MessageSquare, Camera, Sparkles, ThumbsUp, Music, ChevronDown, ChevronUp, Settings2, Eye, X } from 'lucide-react';
import { toast } from 'sonner';
import type { LucideIcon } from 'lucide-react';
import { PolicyEditor } from './policy/PolicyEditor';
import type { PolicyOverride, PlatformPolicies } from '@/types/policy';
import { contentApi, type PlatformPromptPreview } from '@/services/contentApi';
import { useDebounce } from '@/hooks/useDebounce';

interface Platform {
  id: string;
  name: string;
  icon: LucideIcon;
}

const PLATFORMS: Platform[] = [
  { id: 'linkedin', name: 'LinkedIn', icon: Briefcase },
  { id: 'x', name: 'X', icon: MessageSquare },
  { id: 'reddit', name: 'Reddit', icon: MessageSquare },
  { id: 'instagram', name: 'Instagram', icon: Camera },
  { id: 'facebook', name: 'Facebook', icon: ThumbsUp },
  { id: 'tiktok', name: 'TikTok', icon: Music },
];

interface ContentComposerProps {
  onGenerate: (ideaPrompt: string, platforms: string[], platformPolicies: PlatformPolicies) => void;
  isLoading: boolean;
}

export function ContentComposer({ onGenerate, isLoading }: ContentComposerProps) {
  const [ideaPrompt, setIdeaPrompt] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [expandedPlatforms, setExpandedPlatforms] = useState<string[]>([]);
  const [platformPolicies, setPlatformPolicies] = useState<PlatformPolicies>({});
  const [showValidation, setShowValidation] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [promptPreviews, setPromptPreviews] = useState<PlatformPromptPreview[]>([]);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  // Baseline snapshot ref - tracks last saved state to prevent unnecessary saves
  const baselineRef = useRef<string | null>(null);

  // Debounce values for auto-saving
  const debouncedIdea = useDebounce(ideaPrompt, 1000);
  const debouncedPlatforms = useDebounce(selectedPlatforms, 1000);
  const debouncedPolicies = useDebounce(platformPolicies, 1000);
  const debouncedExpanded = useDebounce(expandedPlatforms, 1000);

  // Load preferences on mount
  useEffect(() => {
    async function loadPreferences() {
      try {
        const prefs = await contentApi.getPreferences();
        if (prefs) {
          if (prefs.last_idea_prompt) setIdeaPrompt(prefs.last_idea_prompt);
          if (prefs.last_platform_selection) {
            const saved = JSON.parse(prefs.last_platform_selection);
            // Filter out stale platforms (like 'twitter' if we renamed to 'x')
            const valid = saved.filter((id: string) => PLATFORMS.some(p => p.id === id));
            setSelectedPlatforms(valid);
          }
          if (prefs.last_policies) setPlatformPolicies(JSON.parse(prefs.last_policies));
          if (prefs.last_expanded_platforms) setExpandedPlatforms(JSON.parse(prefs.last_expanded_platforms));
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
      policies: debouncedPolicies,
      expanded: debouncedExpanded,
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
      last_policies: JSON.stringify(debouncedPolicies),
      last_expanded_platforms: JSON.stringify(debouncedExpanded),
    };

    contentApi.updatePreferences(saveData).catch(err => console.error('Failed to save preferences:', err));
  }, [debouncedIdea, debouncedPlatforms, debouncedPolicies, debouncedExpanded, isLoaded]);

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => {
      if (prev.includes(platformId)) {
        // When unchecking, also collapse the settings
        setExpandedPlatforms(exp => exp.filter(id => id !== platformId));
        return prev.filter(id => id !== platformId);
      } else {
        return [...prev, platformId];
      }
    });
    setShowValidation(false);
  };

  const handleToggleExpand = (platformId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handlePolicyChange = (platformId: string, policy: PolicyOverride) => {
    setPlatformPolicies(prev => ({
      ...prev,
      [platformId]: policy,
    }));
  };

  const validateInputs = (): boolean => {
    if (!ideaPrompt.trim()) {
      setShowValidation(true);
      toast.error('Missing idea', {
        description: 'Please enter an idea for your post'
      });
      return false;
    }

    if (selectedPlatforms.length === 0) {
      setShowValidation(true);
      toast.error('No platform selected', {
        description: 'Please select at least one platform'
      });
      return false;
    }

    setShowValidation(false);
    return true;
  };

  const getActivePolicies = (): PlatformPolicies => {
    const activePolicies: PlatformPolicies = {};
    for (const platformId of selectedPlatforms) {
      if (platformPolicies[platformId] && Object.keys(platformPolicies[platformId]).length > 0) {
        activePolicies[platformId] = platformPolicies[platformId];
      }
    }
    return activePolicies;
  };

  const handlePreviewPrompt = async () => {
    if (!validateInputs()) return;

    setIsLoadingPreview(true);
    try {
      const response = await contentApi.previewPrompt({
        idea_prompt: ideaPrompt,
        platforms: selectedPlatforms,
        platform_policies: getActivePolicies(),
      });
      setPromptPreviews(response.previews);
    } catch (error) {
      console.error('Failed to preview prompt:', error);
      toast.error('Failed to preview prompt');
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;
    onGenerate(ideaPrompt, selectedPlatforms, getActivePolicies());
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-2xl">
      <CardHeader>
        <CardTitle className="text-2xl">Create Your Content</CardTitle>
        <CardDescription>
          Describe your idea and select platforms to generate AI-powered content
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Idea Input */}
          <div className="space-y-2">
            <Label htmlFor="idea-prompt" className="text-base font-semibold">
              What's your idea?
            </Label>
            <Textarea
              id="idea-prompt"
              placeholder="E.g., Share tips about staying productive while working from home..."
              value={ideaPrompt}
              onChange={(e) => {
                setIdeaPrompt(e.target.value);
                setShowValidation(false);
              }}
              className={`min-h-[120px] resize-none transition-colors ${showValidation && !ideaPrompt.trim()
                ? 'border-destructive focus-visible:ring-destructive'
                : ''
                }`}
              disabled={isLoading}
            />
            {showValidation && !ideaPrompt.trim() && (
              <p className="text-sm text-destructive">This field is required</p>
            )}
          </div>

          {/* Platform Selection with Expandable Settings */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              Select Platforms
            </Label>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Click the settings icon to customize each platform's output
            </p>
            <div className={`space-y-3 transition-all ${showValidation && selectedPlatforms.length === 0
              ? 'ring-2 ring-destructive/50 rounded-lg p-2'
              : ''
              }`}>
              {PLATFORMS.map((platform) => {
                const Icon = platform.icon;
                const isSelected = selectedPlatforms.includes(platform.id);
                const isExpanded = expandedPlatforms.includes(platform.id);

                return (
                  <div
                    key={platform.id}
                    className={`rounded-lg border transition-all ${isSelected
                      ? 'border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-900/20'
                      : 'hover:bg-accent'
                      }`}
                  >
                    {/* Platform Header */}
                    <div className="flex items-center justify-between p-3">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id={platform.id}
                          checked={isSelected}
                          onCheckedChange={() => handlePlatformToggle(platform.id)}
                          disabled={isLoading}
                        />
                        <Label
                          htmlFor={platform.id}
                          className="flex items-center gap-2 cursor-pointer flex-1"
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{platform.name}</span>
                        </Label>
                      </div>

                      {/* Settings Toggle Button - Only show when selected */}
                      {isSelected && (
                        <button
                          type="button"
                          onClick={(e) => handleToggleExpand(platform.id, e)}
                          className="flex items-center gap-1 px-2 py-1 text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                          disabled={isLoading}
                        >
                          <Settings2 className="w-4 h-4" />
                          <span className="hidden sm:inline">Customize</span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Collapsible Policy Controls */}
                    {isSelected && isExpanded && (
                      <div className="px-3 pb-3 animate-in slide-in-from-top-2 duration-200">
                        <PolicyEditor
                          policy={platformPolicies[platform.id] || {}}
                          onChange={(policy: PolicyOverride) => handlePolicyChange(platform.id, policy)}
                          disabled={isLoading}
                          platform={platform.id}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {showValidation && selectedPlatforms.length === 0 && (
              <p className="text-sm text-destructive">Please select at least one platform</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 text-lg py-6"
              disabled={isLoading || isLoadingPreview}
              onClick={handlePreviewPrompt}
            >
              {isLoadingPreview ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-5 w-5" />
                  Preview Prompt
                </>
              )}
            </Button>
            <Button
              type="submit"
              className="flex-1 text-lg py-6"
              disabled={isLoading || isLoadingPreview}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Content
                </>
              )}
            </Button>
          </div>

          {/* Prompt Preview Section */}
          {promptPreviews.length > 0 && (
            <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Prompt Preview</Label>
                <button
                  type="button"
                  onClick={() => setPromptPreviews([])}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {promptPreviews.map((preview) => (
                <div
                  key={preview.platform}
                  className="rounded-lg border bg-slate-50 dark:bg-slate-900 p-4 space-y-2"
                >
                  <div className="font-medium text-sm text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                    {preview.platform}
                  </div>
                  <pre className="text-sm whitespace-pre-wrap font-mono text-slate-700 dark:text-slate-300 max-h-64 overflow-y-auto">
                    {preview.prompt}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
