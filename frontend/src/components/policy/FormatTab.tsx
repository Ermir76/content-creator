import { Label } from '@/components/ui/label';
import type {
    FormatConfig,
    HookWeights,
    BodyTexture,
    EndingWeights
} from '@/types/policy';

interface FormatTabProps {
    data: FormatConfig;
    onChange: (data: FormatConfig) => void;
    disabled?: boolean;
}

export function FormatTab({ data, onChange, disabled }: FormatTabProps) {
    const hook = data.hook || {};
    const body = data.body || {};
    const texture = body.texture || {};
    const ending = data.ending || {};

    const handleHookChange = (key: keyof HookWeights, value: number) => {
        onChange({ ...data, hook: { ...hook, [key]: value } });
    };

    const handleBodyTypeChange = (value: string) => {
        onChange({ ...data, body: { ...body, type: value } });
    };

    const handleTextureChange = (key: keyof BodyTexture, value: number) => {
        onChange({ ...data, body: { ...body, texture: { ...texture, [key]: value } } });
    };

    const handleEndingChange = (key: keyof EndingWeights, value: number) => {
        onChange({ ...data, ending: { ...ending, [key]: value } });
    };

    const BODY_TYPES = [
        { value: 'honest-experience', label: 'Honest Experience' },
        { value: 'how-to', label: 'How-To Guide' },
        { value: 'list', label: 'Listicle' },
        { value: 'story', label: 'Narrative Story' },
        { value: 'analysis', label: 'Deep Analysis' }
    ];

    return (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            {/* Hook Strategy */}
            <div className="space-y-4">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Hook Strategy (Opening)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <SliderControl label="Punchy (Short)" value={hook.punchy} onChange={(v) => handleHookChange('punchy', v)} disabled={disabled} />
                    <SliderControl label="Question" value={hook.question} onChange={(v) => handleHookChange('question', v)} disabled={disabled} />
                    <SliderControl label="Statistic" value={hook.statistic} onChange={(v) => handleHookChange('statistic', v)} disabled={disabled} />
                    <SliderControl label="Story" value={hook.story} onChange={(v) => handleHookChange('story', v)} disabled={disabled} />
                    <SliderControl label="Bold Claim" value={hook.bold_claim} onChange={(v) => handleHookChange('bold_claim', v)} disabled={disabled} />
                    <SliderControl label="Contrarian" value={hook.contrarian} onChange={(v) => handleHookChange('contrarian', v)} disabled={disabled} />
                    <SliderControl label="Confession" value={hook.confession} onChange={(v) => handleHookChange('confession', v)} disabled={disabled} />
                    <SliderControl label="Pain Point" value={hook.pain_point} onChange={(v) => handleHookChange('pain_point', v)} disabled={disabled} />
                </div>
            </div>

            <hr className="border-slate-200 dark:border-slate-700" />

            {/* Body Structure */}
            <div className="space-y-4">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Body & Structure</h4>

                <div className="space-y-2">
                    <Label className="text-xs font-medium">Primary Structure</Label>
                    <select
                        value={body.type || 'honest-experience'}
                        onChange={(e) => handleBodyTypeChange(e.target.value)}
                        disabled={disabled}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                    >
                        {BODY_TYPES.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                    <SliderControl label="Examples" value={texture.examples} onChange={(v) => handleTextureChange('examples', v)} disabled={disabled} />
                    <SliderControl label="Data Points" value={texture.data} onChange={(v) => handleTextureChange('data', v)} disabled={disabled} />
                    <SliderControl label="Analogies" value={texture.analogy} onChange={(v) => handleTextureChange('analogy', v)} disabled={disabled} />
                    <SliderControl label="Tension" value={texture.tension} onChange={(v) => handleTextureChange('tension', v)} disabled={disabled} />
                </div>
            </div>

            <hr className="border-slate-200 dark:border-slate-700" />

            {/* Ending */}
            <div className="space-y-4">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Ending & CTA</h4>
                <div className="grid grid-cols-2 gap-4">
                    <SliderControl label="One Question" value={ending.one_question} onChange={(v) => handleEndingChange('one_question', v)} disabled={disabled} />
                    <SliderControl label="Call to Action" value={ending.call_to_action} onChange={(v) => handleEndingChange('call_to_action', v)} disabled={disabled} />
                    <SliderControl label="Statement" value={ending.statement} onChange={(v) => handleEndingChange('statement', v)} disabled={disabled} />
                    <SliderControl label="Cliffhanger" value={ending.cliffhanger} onChange={(v) => handleEndingChange('cliffhanger', v)} disabled={disabled} />
                    <SliderControl label="Callback" value={ending.callback} onChange={(v) => handleEndingChange('callback', v)} disabled={disabled} />
                    <SliderControl label="Challenge" value={ending.challenge} onChange={(v) => handleEndingChange('challenge', v)} disabled={disabled} />
                </div>
            </div>
        </div>
    );
}

// Reuse Slider Helper
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
