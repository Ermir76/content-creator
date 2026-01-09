import { Search } from 'lucide-react';
import type { Platform, ContentFilters } from '../types/content';

const PLATFORMS: { value: Platform | 'all'; label: string }[] = [
    { value: 'all', label: 'All Platforms' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'reddit', label: 'Reddit' },
    { value: 'instagram', label: 'Instagram' },
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
        </div>
    );
}
