import type { Draft } from '../../types/content';

interface DraftTabsProps {
    drafts: Draft[];
    selectedIndex: number;
    onSelect: (index: number) => void;
}

export function DraftTabs({ drafts, selectedIndex, onSelect }: DraftTabsProps) {
    if (!drafts || drafts.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2 mb-2">
            {drafts.map((draft, idx) => (
                <button
                    key={idx}
                    onClick={() => onSelect(idx)}
                    className={`px-3 py-1 text-xs rounded-full transition-all border ${selectedIndex === idx
                        ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700 font-medium'
                        : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                    title={`${draft.step} used ${draft.model}`}
                >
                    {draft.step === "Final Judge" ? "✨ Final" :
                        draft.step === "Generator (v1)" ? "📝 V1" :
                            draft.step.includes("Critic") ? "🤔 V2" :
                                draft.step === "Improver (v3)" ? "🔬 V3" :
                                    draft.step}
                </button>
            ))}
        </div>
    );
}
