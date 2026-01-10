/**
 * Policy override types for per-platform content customization.
 * Matches the backend PolicyOverride Pydantic model.
 */

export type Tone = 'Professional' | 'Casual' | 'Direct' | 'Storytelling';

export type HookStyle = 'Question' | 'Bold statement' | 'Story' | 'Fact' | 'Anti-pattern';

export type CTAStrength = 'None' | 'Soft' | 'Medium' | 'Strong';

export type Feature = 'hashtags' | 'emojis' | 'questions' | 'short_paragraphs';

export interface PolicyOverride {
    target_chars?: number;  // 500-1500
    tone?: Tone;
    features?: Feature[];
    voice_profile?: string;
    hook_style?: HookStyle;
    cta_strength?: CTAStrength;
}

export interface PlatformPolicies {
    [platform: string]: PolicyOverride;
}

// Default policy values
export const DEFAULT_POLICY: PolicyOverride = {
    target_chars: 700,
    tone: 'Professional',
    features: [],
    voice_profile: '',
    hook_style: 'Question',
    cta_strength: 'Soft',
};

// UI labels for display
export const TONE_OPTIONS: { value: Tone; label: string }[] = [
    { value: 'Professional', label: 'Professional' },
    { value: 'Casual', label: 'Casual' },
    { value: 'Direct', label: 'Direct' },
    { value: 'Storytelling', label: 'Storytelling' },
];

export const HOOK_STYLE_OPTIONS: { value: HookStyle; label: string }[] = [
    { value: 'Question', label: 'Question' },
    { value: 'Bold statement', label: 'Bold Statement' },
    { value: 'Story', label: 'Story' },
    { value: 'Fact', label: 'Fact' },
    { value: 'Anti-pattern', label: 'Anti-pattern' },
];

export const CTA_STRENGTH_OPTIONS: { value: CTAStrength; label: string }[] = [
    { value: 'None', label: 'None' },
    { value: 'Soft', label: 'Soft' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Strong', label: 'Strong' },
];

export const FEATURE_OPTIONS: { value: Feature; label: string }[] = [
    { value: 'hashtags', label: 'Hashtags' },
    { value: 'emojis', label: 'Emojis' },
    { value: 'questions', label: 'Questions' },
    { value: 'short_paragraphs', label: 'Short Paragraphs' },
];
