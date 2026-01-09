import axios from 'axios';
import type { ContentHistoryItem } from '../types/content';

const API_BASE_URL = '/content';

/**
 * API service for content history operations
 */
export const contentApi = {
    /**
     * Fetch all generated content history from the backend
     * @returns Promise with array of content history items
     */
    async getHistory(): Promise<ContentHistoryItem[]> {
        const response = await axios.get<ContentHistoryItem[]>(API_BASE_URL);
        return response.data;
    },
};
