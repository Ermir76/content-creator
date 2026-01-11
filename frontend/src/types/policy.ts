export interface Constraints {
    char_limit?: number;
    target_chars?: number;
    hashtags?: number;
}

export interface PersonalityConfig {
    human?: number;
    professional?: number;
    friendly?: number;
    vulnerable?: number;
    provocative?: number;
    opinionated?: number;
}

export interface AuthenticityConfig {
    honest?: number;
    polished?: number;
    raw?: number;
}

export interface AuthorPersona {
    perspective?: string;
    personality?: PersonalityConfig;
    authenticity?: AuthenticityConfig;
    corporate?: boolean;
}

export interface StyleWeights {
    direct?: number;
    indirect?: number;
    casual?: number;
}

export interface MoodWeights {
    reflective?: number;
    energetic?: number;
    serious?: number;
    inspiring?: number;
    urgent?: number;
    calm?: number;
    defiant?: number;
    curious?: number;
}

export interface ApproachWeights {
    direct?: number;
    storytelling?: number;
    educational?: number;
}

export interface HumorConfig {
    enabled?: boolean;
    intensity?: number;
    types?: Record<string, number>;
}

export interface WritingStyle {
    style?: StyleWeights;
    mood?: MoodWeights;
    approach?: ApproachWeights;
    humor?: HumorConfig;
    short_paragraphs?: boolean;
    emojis?: string; // none, low, mild, heavy
}

export interface HookWeights {
    punchy?: number;
    question?: number;
    statistic?: number;
    story?: number;
    bold_claim?: number;
    contrarian?: number;
    confession?: number;
    pain_point?: number;
}

export interface BodyTexture {
    examples?: number;
    data?: number;
    analogy?: number;
    dialogue?: number;
    tension?: number;
}

export interface BodyConfig {
    type?: string;
    texture?: BodyTexture;
}

export interface EndingWeights {
    one_question?: number;
    call_to_action?: number;
    statement?: number;
    cliffhanger?: number;
    callback?: number;
    challenge?: number;
}

export interface FormatConfig {
    hook?: HookWeights;
    body?: BodyConfig;
    ending?: EndingWeights;
}

export interface ModelRouting {
    default?: string;
    pipeline?: Record<string, string>;
}

/**
 * The Full Policy Override Object.
 * Matches app/models/schemas.py PolicyOverride
 */
export interface PolicyOverride {
    constraints?: Constraints;
    author_persona?: AuthorPersona;
    writing_style?: WritingStyle;
    format?: FormatConfig;
    models?: ModelRouting;

    // Legacy simple fields (kept for compatibility if needed)
    tone?: string;
    voice_profile?: string;
}

export interface PlatformPolicies {
    [platform: string]: PolicyOverride;
}

// UI Helpers (Labels)
export const EMOJI_OPTIONS = [
    { value: 'none', label: 'None' },
    { value: 'low', label: 'Low' },
    { value: 'mild', label: 'Mild' },
    { value: 'heavy', label: 'Heavy' },
];

export const PERSPECTIVE_OPTIONS = [
    { value: 'first-person', label: 'First Person (I)' },
    { value: 'second-person', label: 'Second Person (You)' },
    { value: 'third-person', label: 'Third Person (They)' },
];
