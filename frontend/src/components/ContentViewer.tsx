import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { InspirationEmptyState } from './InspirationEmptyState';
import { GeneratedContentCard } from './GeneratedContentCard';
import { Loader2 } from 'lucide-react';
import type { PlatformResult } from '@/types/content';
import { cn } from '@/lib/utils';
import { PLATFORMS } from './ContentComposer'; // Borrowing platform list/icons

interface ContentViewerProps {
    results: PlatformResult[];
    isLoading: boolean;
    onRetry: (platform: string) => void;
    onSave: (result: PlatformResult) => Promise<void>;
}

export function ContentViewer({ results, isLoading, onRetry, onSave }: ContentViewerProps) {
    const [activePlatformId, setActivePlatformId] = useState<string | null>(null);

    // Auto-select first platform when results arrive
    useEffect(() => {
        if (results.length > 0 && !activePlatformId) {
            setActivePlatformId(results[0].platform);
        }
    }, [results]);

    // If loading, show centered loader
    if (isLoading) {
        return (
            <div className="h-full min-h-[500px] flex items-center justify-center rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                    <p className="text-slate-500 animate-pulse">Forging content...</p>
                </div>
            </div>
        );
    }

    // If no results, show the Prophecy/Empty State
    if (results.length === 0) {
        return <InspirationEmptyState className="h-full" />;
    }

    const activeResult = results.find(r => r.platform === activePlatformId) || results[0];

    return (
        <Card className="h-full min-h-[500px] flex flex-col border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden transition-all duration-500 ease-in-out">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-6 py-4">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                    {/* Platform Switcher Tabs */}
                    {results.map((result) => {
                        const platformDef = PLATFORMS.find(p => p.id === result.platform);
                        const Icon = platformDef?.icon;
                        const label = platformDef?.name || result.platform;
                        const isActive = activePlatformId === result.platform;

                        return (
                            <button
                                key={result.platform}
                                onClick={() => setActivePlatformId(result.platform)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                                    isActive
                                        ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700"
                                        : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                                )}
                            >
                                {Icon && <Icon className="w-4 h-4" />}
                                {label}
                            </button>
                        );
                    })}
                </div>
            </CardHeader>

            <CardContent className="flex-1 p-0 bg-slate-50/30 dark:bg-slate-900/30">
                {/* The Content Area */}
                <div className="p-6 h-full">
                    {activeResult && (
                        <div className="animate-in fade-in zoom-in-95 duration-300">
                            <GeneratedContentCard
                                platform={activeResult.platform}
                                success={activeResult.success}
                                content={activeResult.content}
                                modelUsed={activeResult.model_used}
                                error={activeResult.error}
                                errorCode={activeResult.error_code}
                                drafts={activeResult.drafts}
                                onRetry={() => onRetry(activeResult.platform)}
                                onSave={async () => await onSave(activeResult)}
                            />
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
