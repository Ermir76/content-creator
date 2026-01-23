import React from 'react';
import { Search, Filter, Calendar } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface HistoryFiltersProps {
    searchQuery?: string;
    onSearchChange?: (value: string) => void;
    selectedPlatform?: string;
    onPlatformChange?: (value: string) => void;
    timeRange?: string;
    onTimeRangeChange?: (value: string) => void;
}

export const HistoryFilters: React.FC<HistoryFiltersProps> = ({
    searchQuery = "",
    onSearchChange = () => { },
    selectedPlatform = "all",
    onPlatformChange = () => { },
    timeRange = "all",
    onTimeRangeChange = () => { },
}) => {
    return (
        <div className="w-full flex flex-col md:flex-row gap-4 p-4 rounded-2xl bg-card/30 backdrop-blur-md border border-border/50 shadow-lg mb-8 animate-fade-in z-10 relative">
            {/* Alchemy Flourishes */}
            <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-primary/20 rounded-tl-xl pointer-events-none" />
            <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-primary/20 rounded-tr-xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-l border-b border-primary/20 rounded-bl-xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-primary/20 rounded-br-xl pointer-events-none" />
            {/* Search Input */}
            <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                    <Search className="w-4 h-4" />
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search your potions..."
                    className="w-full pl-10 pr-4 py-2.5 bg-background/50 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all placeholder:text-muted-foreground/50 text-sm"
                />
            </div>

            {/* Platform Filter */}
            <div className="w-full md:w-48">
                <Select value={selectedPlatform} onValueChange={onPlatformChange}>
                    <SelectTrigger className="w-full bg-background/50 border-input rounded-xl focus:ring-primary/20 hover:border-primary/30 transition-all">
                        <div className="flex items-center gap-2 text-muted-foreground/80">
                            <Filter className="w-4 h-4" />
                            <SelectValue placeholder="Platform" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Platforms</SelectItem>
                        <SelectItem value="x">X/Twitter</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="reddit">Reddit</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Time Range Filter */}
            <div className="w-full md:w-48">
                <Select value={timeRange} onValueChange={onTimeRangeChange}>
                    <SelectTrigger className="w-full bg-background/50 border-input rounded-xl focus:ring-primary/20 hover:border-primary/30 transition-all">
                        <div className="flex items-center gap-2 text-muted-foreground/80">
                            <Calendar className="w-4 h-4" />
                            <SelectValue placeholder="Time Range" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">Past Week</SelectItem>
                        <SelectItem value="month">Past Month</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};
