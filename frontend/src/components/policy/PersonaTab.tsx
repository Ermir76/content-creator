import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { AuthorPersona, PersonalityConfig, AuthenticityConfig } from '@/types/policy';
import { PERSPECTIVE_OPTIONS } from '@/types/policy';

interface PersonaTabProps {
    data: AuthorPersona;
    onChange: (data: AuthorPersona) => void;
    disabled?: boolean;
}

export function PersonaTab({ data, onChange, disabled }: PersonaTabProps) {
    const personality = data.personality || {};
    const authenticity = data.authenticity || {};

    const handlePersonalityChange = (key: keyof PersonalityConfig, value: number) => {
        onChange({
            ...data,
            personality: { ...personality, [key]: value }
        });
    };

    const handleAuthenticityChange = (key: keyof AuthenticityConfig, value: number) => {
        onChange({
            ...data,
            authenticity: { ...authenticity, [key]: value }
        });
    };

    return (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            {/* Core Settings */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-sm font-medium">Perspective</Label>
                    <select
                        value={data.perspective || 'first-person'}
                        onChange={(e) => onChange({ ...data, perspective: e.target.value })}
                        disabled={disabled}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                    >
                        {PERSPECTIVE_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg bg-white dark:bg-slate-900/50">
                    <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Corporate Voice</Label>
                        <p className="text-xs text-slate-500">Brand voice mode</p>
                    </div>
                    <Switch
                        checked={data.corporate || false}
                        onCheckedChange={(checked: boolean) => onChange({ ...data, corporate: checked })}
                        disabled={disabled}
                    />
                </div>
            </div>

            <hr className="border-slate-200 dark:border-slate-700" />

            {/* Personality Traits */}
            <div className="space-y-4">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    Personality Traits
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <SliderControl
                        label="Humanity"
                        subLabel="Robot ↔ Human"
                        value={personality.human}
                        onChange={(v) => handlePersonalityChange('human', v)}
                        disabled={disabled}
                    />
                    <SliderControl
                        label="Professionalism"
                        subLabel="Casual ↔ Formal"
                        value={personality.professional}
                        onChange={(v) => handlePersonalityChange('professional', v)}
                        disabled={disabled}
                    />
                    <SliderControl
                        label="Friendliness"
                        subLabel="Cold ↔ Warm"
                        value={personality.friendly}
                        onChange={(v) => handlePersonalityChange('friendly', v)}
                        disabled={disabled}
                    />
                    <SliderControl
                        label="Vulnerability"
                        subLabel="Guarded ↔ Open"
                        value={personality.vulnerable}
                        onChange={(v) => handlePersonalityChange('vulnerable', v)}
                        disabled={disabled}
                    />
                    <SliderControl
                        label="Provocative"
                        subLabel="Safe ↔ Edgy"
                        value={personality.provocative}
                        onChange={(v) => handlePersonalityChange('provocative', v)}
                        disabled={disabled}
                    />
                    <SliderControl
                        label="Opinionated"
                        subLabel="Neutral ↔ Strong"
                        value={personality.opinionated}
                        onChange={(v) => handlePersonalityChange('opinionated', v)}
                        disabled={disabled}
                    />
                </div>
            </div>

            <hr className="border-slate-200 dark:border-slate-700" />

            {/* Authenticity */}
            <div className="space-y-4">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Authenticity</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <SliderControl
                        label="Honesty"
                        value={authenticity.honest}
                        onChange={(v) => handleAuthenticityChange('honest', v)}
                        disabled={disabled}
                    />
                    <SliderControl
                        label="Polished"
                        subLabel="Raw ↔ Edited"
                        value={authenticity.polished}
                        onChange={(v) => handleAuthenticityChange('polished', v)}
                        disabled={disabled}
                    />
                    <SliderControl
                        label="Raw"
                        subLabel="Polished ↔ Unfiltered"
                        value={authenticity.raw}
                        onChange={(v) => handleAuthenticityChange('raw', v)}
                        disabled={disabled}
                    />
                </div>
            </div>
        </div>
    );
}

// Helper Slider
function SliderControl({ label, subLabel, value, onChange, disabled }: {
    label: string,
    subLabel?: string,
    value?: number,
    onChange: (val: number) => void,
    disabled?: boolean
}) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-baseline">
                <Label className="text-xs font-medium">{label}</Label>
                {subLabel && <span className="text-[10px] text-slate-400">{subLabel}</span>}
            </div>
            <div className="flex items-center gap-3">
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={value ?? 0}
                    onChange={(e) => onChange(parseFloat(e.target.value))}
                    disabled={disabled}
                    className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <span className="text-xs w-8 text-right font-mono text-slate-500">
                    {(value ?? 0).toFixed(1)}
                </span>
            </div>
        </div>
    );
}
