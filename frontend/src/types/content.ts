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
 * Supported platform types
 */
export type Platform = 'linkedin' | 'twitter' | 'reddit' | 'instagram' | 'facebook' | 'tiktok';

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
