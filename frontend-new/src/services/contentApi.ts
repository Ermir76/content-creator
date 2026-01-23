import axios from 'axios';
import type { ContentHistoryItem } from '../types/content';
import type { PlatformPolicies } from '../types/policy';

const API_BASE_URL = '/content';

/**
 * Preview prompt request/response types
 */
export interface PromptPreviewRequest {
    idea_prompt: string;
    platforms: string[];
    platform_policies?: PlatformPolicies;
}

export interface PlatformPromptPreview {
    platform: string;
    prompt: string;
}

export interface PromptPreviewResponse {
    previews: PlatformPromptPreview[];
}

/**
 * Data required to save generated content
 */
export interface SaveContentData {
    idea_prompt: string;
    platform: string;
    content_text: string;
    model_used?: string;
    char_count?: number;
}

/**
 * API service for content operations
 */
export const contentApi = {
    /**
     * Fetch all saved content history from the backend
     */
    async getHistory(): Promise<ContentHistoryItem[]> {
        const response = await axios.get<ContentHistoryItem[]>(API_BASE_URL);
        return response.data;
    },

    /**
     * Save a single piece of generated content to the database
     */
    async saveContent(data: SaveContentData): Promise<ContentHistoryItem> {
        const response = await axios.post<ContentHistoryItem>(`${API_BASE_URL}/save`, data);
        return response.data;
    },

    /**
     * Delete a saved content item by ID
     */
    async deleteContent(id: number): Promise<void> {
        await axios.delete(`${API_BASE_URL}/${id}`);
    },

    /**
     * Update the text of a saved content item
     */
    async updateContent(id: number, contentText: string): Promise<ContentHistoryItem> {
        const response = await axios.put<ContentHistoryItem>(`${API_BASE_URL}/${id}`, {
            content_text: contentText,
        });
        return response.data;
    },

    /**
     * Get user preferences
     */
    async getPreferences(): Promise<UserPreferenceResponse> {
        const response = await axios.get<UserPreferenceResponse>('/preferences/');
        return response.data;
    },

    /**
     * Update user preferences
     */
    async updatePreferences(data: UserPreferenceUpdate): Promise<UserPreferenceResponse> {
        const response = await axios.post<UserPreferenceResponse>('/preferences/', data);
        return response.data;
    },

    /**
     * Get platform defaults
     */
    async getPlatformConfig(platform: string): Promise<{ char_limit: number, max_hashtags?: number }> {
        const response = await axios.get<{ char_limit: number, max_hashtags?: number }>(`/preferences/platform/${platform}`);
        return response.data;
    },

    /**
     * Preview prompts that would be sent to AI without generating content
     */
    async previewPrompt(data: PromptPreviewRequest): Promise<PromptPreviewResponse> {
        const response = await axios.post<PromptPreviewResponse>(`${API_BASE_URL}/preview-prompt`, data);
        return response.data;
    },
};

export interface UserPreferenceUpdate {
    last_idea_prompt?: string;
    last_platform_selection?: string; // JSON
    last_policies?: string; // JSON
    last_expanded_platforms?: string; // JSON
}

export interface UserPreferenceResponse {
    id: number;
    user_id: number;
    last_idea_prompt?: string;
    last_platform_selection?: string;
    last_policies?: string;
    last_expanded_platforms?: string;
    updated_at: string;
}
