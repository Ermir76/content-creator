import { Sparkles, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InspirationEmptyStateProps {
    className?: string;
}

export function InspirationEmptyState({ className }: InspirationEmptyStateProps) {
    return (
        <div className={cn("h-full min-h-[500px] flex flex-col items-center justify-center p-8 rounded-2xl relative overflow-hidden text-center", className)}>
            {/* Warm Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-highlight/10" />

            {/* Playful Blob Effects */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-highlight/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />

            {/* Content */}
            <div className="relative z-10 max-w-lg mx-auto space-y-8">

                {/* Icon */}
                <div className="flex justify-center">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-highlight/20 flex items-center justify-center animate-playful-pulse">
                            <Lightbulb className="w-10 h-10 text-highlight" strokeWidth={1.5} />
                        </div>
                        <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-accent animate-bounce" />
                    </div>
                </div>

                {/* Friendly Text */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-foreground">
                        Ready to create something amazing?
                    </h2>

                    <p className="text-lg text-muted-foreground leading-relaxed">
                        Share your idea on the left, pick your platforms, and watch the magic happen!
                    </p>
                </div>

                {/* Fun Tags */}
                <div className="flex flex-wrap justify-center gap-3 pt-4">
                    <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                        Creative
                    </span>
                    <span className="px-4 py-2 rounded-full bg-secondary/20 text-secondary-foreground text-sm font-semibold">
                        Engaging
                    </span>
                    <span className="px-4 py-2 rounded-full bg-highlight/20 text-highlight-foreground text-sm font-semibold">
                        Tailored
                    </span>
                </div>
            </div>
        </div>
    );
}
