/**
 * TypeScript interfaces for content history
 * Matches the GeneratedContentResponse model from the backend
 */

export interface ContentHistoryItem {
    id: number;
    idea_prompt: string;
    platform: string;
    content_text: string;
    status: string;
    created_at: string; // ISO date string from backend
    user_id: number;
    // Quality tracking fields
    model_used?: string;
    validation_passed?: boolean;
    regeneration_count?: number;
    char_count?: number;
}

/**
 * Represents a single step's draft in the agentic flow
 */
export interface Draft {
    step: string;
    model: string;
    content: string;
}

/**
 * Result of content generation for a single platform
 */
export interface PlatformResult {
    platform: string;
    success: boolean;
    content?: string;
    model_used?: string;
    error?: string;
    error_code?: string;
    char_count?: number;
    drafts?: Draft[];
}

/**
 * Supported platform types
 */
export type Platform = 'linkedin' | 'x' | 'reddit' | 'instagram' | 'facebook' | 'tiktok';

/**
 * Date range filter options
 */
export type DateRange = 'all' | 'today' | 'week' | 'month' | 'quarter';

/**
 * Filter options for content history
 */
export interface ContentFilters {
    searchQuery?: string;
    platform?: Platform | 'all';
    dateRange?: DateRange;
}
