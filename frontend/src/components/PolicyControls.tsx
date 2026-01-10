import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import type {
    PolicyOverride,
    Tone,
    HookStyle,
    CTAStrength,
    Feature,
} from '@/types/policy';
import {
    TONE_OPTIONS as toneOptions,
    HOOK_STYLE_OPTIONS as hookOptions,
    CTA_STRENGTH_OPTIONS as ctaOptions,
    FEATURE_OPTIONS as featureOptions,
    DEFAULT_POLICY,
} from '@/types/policy';

interface PolicyControlsProps {
    policy: PolicyOverride;
    onChange: (policy: PolicyOverride) => void;
    disabled?: boolean;
}

export function PolicyControls({ policy, onChange, disabled }: PolicyControlsProps) {
    const currentPolicy = { ...DEFAULT_POLICY, ...policy };

    const handleTargetCharsChange = (value: number) => {
        onChange({ ...policy, target_chars: value });
    };

    const handleToneChange = (tone: Tone) => {
        onChange({ ...policy, tone });
    };

    const handleHookStyleChange = (hook_style: HookStyle) => {
        onChange({ ...policy, hook_style });
    };

    const handleCtaStrengthChange = (cta_strength: CTAStrength) => {
        onChange({ ...policy, cta_strength });
    };

    const handleFeatureToggle = (feature: Feature) => {
        const currentFeatures = policy.features || [];
        const newFeatures = currentFeatures.includes(feature)
            ? currentFeatures.filter(f => f !== feature)
            : [...currentFeatures, feature];
        onChange({ ...policy, features: newFeatures });
    };

    const handleVoiceProfileChange = (voice_profile: string) => {
        onChange({ ...policy, voice_profile: voice_profile || undefined });
    };

    return (
        <div className="space-y-5 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
            {/* Target Length Slider */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium">Target Length</Label>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                        {currentPolicy.target_chars} chars
                    </span>
                </div>
                <input
                    type="range"
                    min={500}
                    max={1500}
                    step={50}
                    value={currentPolicy.target_chars}
                    onChange={(e) => handleTargetCharsChange(Number(e.target.value))}
                    disabled={disabled}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-xs text-slate-400">
                    <span>500</span>
                    <span>1000</span>
                    <span>1500</span>
                </div>
            </div>

            {/* Tone Selector */}
            <div className="space-y-2">
                <Label className="text-sm font-medium">Tone</Label>
                <div className="flex flex-wrap gap-2">
                    {toneOptions.map(({ value, label }) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => handleToneChange(value)}
                            disabled={disabled}
                            className={`px-3 py-1.5 text-sm rounded-full border transition-all ${currentPolicy.tone === value
                                ? 'bg-blue-500 text-white border-blue-500'
                                : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 hover:border-blue-400'
                                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Features Checkboxes */}
            <div className="space-y-2">
                <Label className="text-sm font-medium">Features</Label>
                <div className="grid grid-cols-2 gap-2">
                    {featureOptions.map(({ value, label }) => (
                        <div key={value} className="flex items-center space-x-2">
                            <Checkbox
                                id={`feature-${value}`}
                                checked={(policy.features || []).includes(value)}
                                onCheckedChange={() => handleFeatureToggle(value)}
                                disabled={disabled}
                            />
                            <Label htmlFor={`feature-${value}`} className="text-sm cursor-pointer">
                                {label}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Hook Style Dropdown */}
            <div className="space-y-2">
                <Label className="text-sm font-medium">Hook Style</Label>
                <select
                    value={currentPolicy.hook_style}
                    onChange={(e) => handleHookStyleChange(e.target.value as HookStyle)}
                    disabled={disabled}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    {hookOptions.map(({ value, label }) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </select>
            </div>

            {/* CTA Strength Selector */}
            <div className="space-y-2">
                <Label className="text-sm font-medium">CTA Strength</Label>
                <div className="flex gap-1">
                    {ctaOptions.map(({ value, label }) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => handleCtaStrengthChange(value)}
                            disabled={disabled}
                            className={`flex-1 px-2 py-1.5 text-sm rounded border transition-all ${currentPolicy.cta_strength === value
                                ? 'bg-blue-500 text-white border-blue-500'
                                : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 hover:border-blue-400'
                                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Voice Profile Text Input */}
            <div className="space-y-2">
                <Label className="text-sm font-medium">Voice Profile (optional)</Label>
                <input
                    type="text"
                    placeholder="e.g., Friendly, approachable, uses examples..."
                    value={policy.voice_profile || ''}
                    onChange={(e) => handleVoiceProfileChange(e.target.value)}
                    disabled={disabled}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
        </div>
    );
}
