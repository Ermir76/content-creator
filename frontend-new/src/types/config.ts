/**
 * UI Config Types for Power User Config Modal
 * These types are used by the config tab components
 */

// Persona Configuration
export interface PersonaConfig {
    perspective: 'first-person' | 'second-person' | 'third-person' | 'we';
    corporate: boolean;
    personality: {
        human: number;
        professional: number;
        friendly: number;
        vulnerable: number;
        provocative: number;
        opinionated: number;
    };
    authenticity: {
        honest: number;
        polished: number;
        raw: number;
    };
}

// Writing Style Configuration
export interface WritingStyleConfig {
    style: {
        direct: number;
        casual: number;
    };
    mood: {
        reflective: number;
        energetic: number;
        serious: number;
        inspiring: number;
        curious: number;
    };
    approach: {
        storytelling: number;
        educational: number;
        direct: number;
    };
    humor: {
        enabled: boolean;
        intensity: number;
        types: {
            dry: number;
            witty: number;
            selfDeprecating: number;
        };
    };
    shortParagraphs: boolean;
    emojis: 'none' | 'low' | 'mild' | 'heavy';
}

// Format Configuration
export interface FormatConfig {
    targetLength: number;
    hashtags: number;
    hook: {
        punchy: number;
        question: number;
        statistic: number;
        story: number;
        boldClaim: number;
        contrarian: number;
    };
    body: {
        type: 'honest-experience' | 'how-to' | 'list' | 'story' | 'analysis';
        texture: {
            examples: number;
            data: number;
            analogy: number;
            tension: number;
        };
    };
    ending: {
        oneQuestion: number;
        callToAction: number;
        statement: number;
        cliffhanger: number;
    };
}

// Models Configuration
export type ModelOption = 'gemini-3-flash-preview' | 'gpt-5-mini' | 'claude-haiku-4-5' | 'grok-4-1-fast-reasoning';

export interface ModelsConfig {
    default: ModelOption;
    pipeline: {
        generator: ModelOption;
        critic: ModelOption;
        improver: ModelOption;
        judge: ModelOption;
    };
}

// Power User Config - combines all sections
export interface PowerUserConfig {
    persona: PersonaConfig;
    style: WritingStyleConfig;
    format: FormatConfig;
    models: ModelsConfig;
}

// Default configs for initial state
export const defaultPersonaConfig: PersonaConfig = {
    perspective: 'first-person',
    corporate: false,
    personality: {
        human: 0.7,
        professional: 0.5,
        friendly: 0.6,
        vulnerable: 0.4,
        provocative: 0.3,
        opinionated: 0.5,
    },
    authenticity: {
        honest: 0.7,
        polished: 0.5,
        raw: 0.4,
    },
};

export const defaultWritingStyleConfig: WritingStyleConfig = {
    style: {
        direct: 0.6,
        casual: 0.5,
    },
    mood: {
        reflective: 0.4,
        energetic: 0.5,
        serious: 0.4,
        inspiring: 0.5,
        curious: 0.5,
    },
    approach: {
        storytelling: 0.5,
        educational: 0.4,
        direct: 0.6,
    },
    humor: {
        enabled: false,
        intensity: 0.5,
        types: {
            dry: 0.3,
            witty: 0.5,
            selfDeprecating: 0.3,
        },
    },
    shortParagraphs: true,
    emojis: 'low',
};

export const defaultFormatConfig: FormatConfig = {
    targetLength: 500,
    hashtags: 3,
    hook: {
        punchy: 0.5,
        question: 0.4,
        statistic: 0.3,
        story: 0.5,
        boldClaim: 0.4,
        contrarian: 0.3,
    },
    body: {
        type: 'honest-experience',
        texture: {
            examples: 0.5,
            data: 0.4,
            analogy: 0.5,
            tension: 0.4,
        },
    },
    ending: {
        oneQuestion: 0.4,
        callToAction: 0.5,
        statement: 0.4,
        cliffhanger: 0.3,
    },
};

export const defaultModelsConfig: ModelsConfig = {
    default: 'gemini-3-flash-preview',
    pipeline: {
        generator: 'gemini-3-flash-preview',
        critic: 'gpt-5-mini',
        improver: 'claude-haiku-4-5',
        judge: 'gemini-3-flash-preview',
    },
};

export const defaultPowerUserConfig: PowerUserConfig = {
    persona: defaultPersonaConfig,
    style: defaultWritingStyleConfig,
    format: defaultFormatConfig,
    models: defaultModelsConfig,
};
