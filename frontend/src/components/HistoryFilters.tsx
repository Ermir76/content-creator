import { Search, Calendar } from 'lucide-react';
import type { Platform, DateRange, ContentFilters } from '../types/content';

const PLATFORMS: { value: Platform | 'all'; label: string }[] = [
    { value: 'all', label: 'All Platforms' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'x', label: 'X' },
    { value: 'reddit', label: 'Reddit' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'tiktok', label: 'TikTok' },
];

const DATE_RANGES: { value: DateRange; label: string }[] = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'Last 7 days' },
    { value: 'month', label: 'Last 30 days' },
    { value: 'quarter', label: 'Last 3 months' },
];

interface HistoryFiltersProps {
    filters: ContentFilters;
    onFiltersChange: (filters: ContentFilters) => void;
}

export function HistoryFilters({ filters, onFiltersChange }: HistoryFiltersProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search content or prompts..."
                    value={filters.searchQuery || ''}
                    onChange={(e) => onFiltersChange({ ...filters, searchQuery: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
            </div>

            {/* Platform Filter */}
            <select
                value={filters.platform || 'all'}
                onChange={(e) => onFiltersChange({ ...filters, platform: e.target.value as Platform | 'all' })}
                className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
            >
                {PLATFORMS.map((p) => (
                    <option key={p.value} value={p.value}>
                        {p.label}
                    </option>
                ))}
            </select>

            {/* Date Range Filter */}
            <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <select
                    value={filters.dateRange || 'all'}
                    onChange={(e) => onFiltersChange({ ...filters, dateRange: e.target.value as DateRange })}
                    className="pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer appearance-none"
                >
                    {DATE_RANGES.map((d) => (
                        <option key={d.value} value={d.value}>
                            {d.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
