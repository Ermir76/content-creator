import { useState, useEffect, useMemo, useCallback } from 'react';
import { Loader2, History, AlertCircle } from 'lucide-react';
import { HistoryCard } from './HistoryCard';
import { HistoryFilters } from './HistoryFilters';
import { contentApi } from '../services/contentApi';
import type { ContentHistoryItem, ContentFilters } from '../types/content';

export function HistoryView() {
    const [items, setItems] = useState<ContentHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<ContentFilters>({
        searchQuery: '',
        platform: 'all',
    });

    // Fetch history on mount
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await contentApi.getHistory();
                setItems(data);
            } catch (err) {
                console.error('Failed to fetch history:', err);
                setError('Failed to load content history. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    // Handle delete - removes item from state after successful API call
    const handleDelete = useCallback(async (id: number) => {
        await contentApi.deleteContent(id);
        setItems(prev => prev.filter(item => item.id !== id));
    }, []);

    // Filter items based on search and platform
    const filteredItems = useMemo(() => {
        return items.filter((item) => {
            // Platform filter
            if (filters.platform && filters.platform !== 'all') {
                if (item.platform.toLowerCase() !== filters.platform.toLowerCase()) {
                    return false;
                }
            }

            // Search filter
            if (filters.searchQuery) {
                const query = filters.searchQuery.toLowerCase();
                const matchesContent = item.content_text.toLowerCase().includes(query);
                const matchesPrompt = item.idea_prompt.toLowerCase().includes(query);
                if (!matchesContent && !matchesPrompt) {
                    return false;
                }
            }

            return true;
        });
    }, [items, filters]);

    // Loading state
    if (loading) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="text-center py-16 px-6 bg-gradient-to-br from-slate-100 to-white dark:from-slate-800/50 dark:to-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto" />
                    <p className="mt-4 text-slate-600 dark:text-slate-300">Loading your content history...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="text-center py-16 px-6 bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-200 dark:border-red-500/30">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                    <p className="mt-4 text-red-600 dark:text-red-400">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <History className="w-6 h-6 text-blue-500" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Content History</h2>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                    ({filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'})
                </span>
            </div>

            {/* Filters */}
            <HistoryFilters filters={filters} onFiltersChange={setFilters} />

            {/* Content Grid */}
            {filteredItems.length > 0 ? (
                <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {filteredItems.map((item, index) => (
                        <div
                            key={item.id}
                            className="animate-in fade-in slide-in-from-bottom-4"
                            style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
                        >
                            <HistoryCard item={item} onDelete={handleDelete} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 px-6 bg-gradient-to-br from-slate-100 to-white dark:from-slate-800/50 dark:to-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <History className="w-12 h-12 text-slate-400 mx-auto" />
                    <h3 className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-200">
                        No content found
                    </h3>
                    <p className="mt-2 text-slate-500 dark:text-slate-400">
                        {items.length === 0
                            ? 'Save some generated content to see it here!'
                            : 'Try adjusting your filters.'}
                    </p>
                </div>
            )}
        </div>
    );
}
