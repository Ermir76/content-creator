import { Crown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InspirationEmptyStateProps {
    className?: string;
}

export function InspirationEmptyState({ className }: InspirationEmptyStateProps) {
    return (
        <div className={cn("h-full min-h-[500px] flex flex-col items-center justify-center p-8 rounded-3xl relative overflow-hidden text-center", className)}>
            {/* Mystical Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#2C5364] via-[#203A43] to-[#2C5364] opacity-90" />

            {/* Gold/Aurora Overlay Effects */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-teal-500/10 mix-blend-overlay" />
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl animate-pulse delay-1000" />

            {/* Content */}
            <div className="relative z-10 max-w-lg mx-auto space-y-8">

                {/* Icon / Sigil */}
                <div className="flex justify-center">
                    <div className="relative">
                        <Crown className="w-16 h-16 text-amber-200/80 drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]" strokeWidth={1} />
                        <Sparkles className="absolute -top-2 -right-4 w-6 h-6 text-teal-200 animate-pulse" />
                    </div>
                </div>

                {/* The Prophecy Text */}
                <div className="space-y-6">
                    <h2 className="text-xl font-medium tracking-[0.2em] text-amber-100/60 uppercase">
                        The Forged Prophecy
                    </h2>

                    <div className="space-y-2">
                        <p className="font-serif italic text-2xl md:text-3xl leading-relaxed text-transparent bg-clip-text bg-gradient-to-tr from-amber-100 via-teal-50 to-amber-100 drop-shadow-sm">
                            "When the mind aligns with the machine, words shall flow like liquid starlight."
                        </p>
                        <p className="font-serif italic text-lg text-slate-300/80">
                            Let the digital winds carry your message across the constellations of the mind.
                        </p>
                    </div>
                </div>

                {/* Decorative Hashtags */}
                <div className="flex flex-wrap justify-center gap-3 pt-4">
                    <span className="px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-900/20 text-xs font-bold tracking-widest text-amber-200 uppercase">
                        #StarlightScribe
                    </span>
                    <span className="px-4 py-1.5 rounded-full border border-teal-500/30 bg-teal-900/20 text-xs font-bold tracking-widest text-teal-200 uppercase">
                        #VoidNexus
                    </span>
                    <span className="px-4 py-1.5 rounded-full border border-slate-500/30 bg-slate-800/20 text-xs font-bold tracking-widest text-slate-300 uppercase">
                        #AIAlchemy
                    </span>
                </div>
            </div>
        </div>
    );
}
