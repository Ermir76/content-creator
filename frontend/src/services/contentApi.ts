import axios from 'axios';
import type { ContentHistoryItem } from '../types/content';

const API_BASE_URL = '/content';

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
};
