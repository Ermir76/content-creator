import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { ScrollText, ArrowLeft, Loader2, SearchX, AlertCircle } from "lucide-react";
import { HistoryFilters } from "@/components/HistoryFilters";
import { HistoryCard } from "@/components/HistoryCard";
import { ContentModal } from "@/components/ContentModal";
import { contentApi } from "@/services/contentApi";
import type { ContentHistoryItem } from "@/types/content";
import { toast } from "sonner";

export function HistoryPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [historyItems, setHistoryItems] = useState<ContentHistoryItem[]>([]);

    // Filter State
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPlatform, setSelectedPlatform] = useState("all");
    const [timeRange, setTimeRange] = useState("all");

    // Modal State
    const [editingItem, setEditingItem] = useState<ContentHistoryItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch history on mount
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await contentApi.getHistory();
                setHistoryItems(data);
            } catch (err) {
                console.error('Failed to fetch history:', err);
                setError('Failed to load content history. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, []);

    // Handle delete with API call
    const handleDelete = useCallback(async (id: number) => {
        try {
            await contentApi.deleteContent(id);
            setHistoryItems(prev => prev.filter(item => item.id !== id));
            toast.success("Potion removed from archives");
        } catch (err) {
            console.error('Failed to delete:', err);
            toast.error("Failed to delete content");
        }
    }, []);

    const handleEdit = (item: ContentHistoryItem) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    // Handle save with API call
    const handleSaveContent = useCallback(async (id: number, newContent: string) => {
        try {
            await contentApi.updateContent(id, newContent);
            setHistoryItems(prev => prev.map(item =>
                item.id === id ? { ...item, content_text: newContent } : item
            ));
            toast.success("Potion content updated");
        } catch (err) {
            console.error('Failed to update:', err);
            toast.error("Failed to update content");
        }
    }, []);

    // Date range cutoff helper - returns milliseconds for comparison
    const getDateRangeCutoffMs = (range: string): number | null => {
        if (!range || range === 'all') return null;
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        switch (range) {
            case 'today':
                // Start of today in user's local timezone, converted to ms
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return today.getTime();
            case 'week':
                return now - 7 * oneDay;
            case 'month':
                return now - 30 * oneDay;
            case 'quarter':
                return now - 90 * oneDay;
            default:
                return null;
        }
    };

    // Filter Logic
    const filteredItems = useMemo(() => {
        const cutoffMs = getDateRangeCutoffMs(timeRange);

        return historyItems.filter(item => {
            // Platform filter
            if (selectedPlatform && selectedPlatform !== 'all') {
                if (item.platform.toLowerCase() !== selectedPlatform.toLowerCase()) {
                    return false;
                }
            }

            // Search filter - check content_text and idea_prompt
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesContent = item.content_text.toLowerCase().includes(query);
                const matchesPrompt = item.idea_prompt.toLowerCase().includes(query);
                if (!matchesContent && !matchesPrompt) {
                    return false;
                }
            }

            // Date range filter - compare timestamps (timezone-agnostic)
            if (cutoffMs !== null) {
                const itemMs = new Date(item.created_at).getTime();
                if (itemMs < cutoffMs) {
                    return false;
                }
            }

            return true;
        });
    }, [historyItems, searchQuery, selectedPlatform, timeRange]);

    return (
        <main className="px-6 py-8 min-h-screen relative overflow-hidden">
            {/* Background Decoration matching App.tsx */}
            <div className="fixed inset-0 pointer-events-none z-[-1]">
                <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" />
                <div className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow delay-1000" />
            </div>

            <div className="max-w-5xl mx-auto z-10 relative">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="p-2 -ml-2 rounded-full hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <ScrollText className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h1 className="font-display text-3xl font-bold text-foreground">
                                    Potion <span className="gradient-text">Archive</span>
                                </h1>
                                {!isLoading && !error && (
                                    <p className="text-sm text-muted-foreground">
                                        {filteredItems.length} {filteredItems.length === 1 ? 'potion' : 'potions'} found
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <HistoryFilters
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    selectedPlatform={selectedPlatform}
                    onPlatformChange={setSelectedPlatform}
                    timeRange={timeRange}
                    onTimeRangeChange={setTimeRange}
                />

                {/* Content Area */}
                <div className="min-h-[400px]">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-64 animate-fade-in">
                            <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                            <p className="text-muted-foreground text-sm">Reviewing the archives...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
                            <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
                                <AlertCircle className="w-10 h-10 text-destructive/70" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-foreground/80">Failed to load archives</h3>
                            <p className="text-muted-foreground max-w-sm mb-6">{error}</p>
                        </div>
                    ) : filteredItems.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                            {filteredItems.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="animate-fade-in"
                                    style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
                                >
                                    <HistoryCard
                                        item={item}
                                        onDelete={handleDelete}
                                        onEdit={handleEdit}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        // Empty State
                        <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in-up">
                            <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mb-6">
                                <SearchX className="w-10 h-10 text-muted-foreground/50" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-foreground/80">No potions found</h3>
                            <p className="text-muted-foreground max-w-sm mb-6">
                                {historyItems.length === 0
                                    ? "The archives are currently empty. Save some brewed potions to see them here!"
                                    : "Try adjusting your filters."}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <ContentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                item={editingItem}
                onSave={handleSaveContent}
            />
        </main>
    );
}
