import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import type {
    WritingStyle,
    StyleWeights,
    ApproachWeights,
    MoodWeights,
    HumorConfig
} from '@/types/policy';
import { EMOJI_OPTIONS } from '@/types/policy';

interface StyleTabProps {
    data: WritingStyle;
    onChange: (data: WritingStyle) => void;
    disabled?: boolean;
}

export function StyleTab({ data, onChange, disabled }: StyleTabProps) {
    const style = data.style || {};
    const approach = data.approach || {};
    const mood = data.mood || {};
    const humor = data.humor || {};
    const humorTypes = humor.types || {};

    const handleStyleChange = (key: keyof StyleWeights, value: number) => {
        onChange({ ...data, style: { ...style, [key]: value } });
    };

    const handleApproachChange = (key: keyof ApproachWeights, value: number) => {
        onChange({ ...data, approach: { ...approach, [key]: value } });
    };

    const handleMoodChange = (key: keyof MoodWeights, value: number) => {
        onChange({ ...data, mood: { ...mood, [key]: value } });
    };

    const handleHumorChange = (key: keyof HumorConfig, value: any) => {
        onChange({ ...data, humor: { ...humor, [key]: value } });
    };

    const toggleHumorType = (typeKey: string) => {
        const currentVal = humorTypes[typeKey] || 0;
        const newVal = currentVal > 0 ? 0.0 : 1.0;
        onChange({
            ...data,
            humor: {
                ...humor,
                types: { ...humorTypes, [typeKey]: newVal }
            }
        });
    };

    const HUMOR_TYPES_LIST = ['dry', 'witty', 'sarcastic', 'slapstick', 'self_deprecating', 'absurdist'];

    return (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            {/* Writing Style */}
            <div className="space-y-4">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Writing Style</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SliderControl
                        label="Directness"
                        subLabel="Indirect ↔ Direct"
                        value={style.direct}
                        onChange={(v) => handleStyleChange('direct', v)}
                        disabled={disabled}
                    />
                    <SliderControl
                        label="Casual"
                        subLabel="Formal ↔ Chatty"
                        value={style.casual}
                        onChange={(v) => handleStyleChange('casual', v)}
                        disabled={disabled}
                    />
                    <SliderControl
                        label="Indirect"
                        subLabel="Direct ↔ Indirect"
                        value={style.indirect}
                        onChange={(v) => handleStyleChange('indirect', v)}
                        disabled={disabled}
                    />
                </div>
            </div>

            <hr className="border-slate-200 dark:border-slate-700" />

            {/* Approach */}
            <div className="space-y-4">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Approach Strategy</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <SliderControl
                        label="Direct"
                        value={approach.direct}
                        onChange={(v) => handleApproachChange('direct', v)}
                        disabled={disabled}
                    />
                    <SliderControl
                        label="Storytelling"
                        value={approach.storytelling}
                        onChange={(v) => handleApproachChange('storytelling', v)}
                        disabled={disabled}
                    />
                    <SliderControl
                        label="Educational"
                        value={approach.educational}
                        onChange={(v) => handleApproachChange('educational', v)}
                        disabled={disabled}
                    />
                </div>
            </div>

            <hr className="border-slate-200 dark:border-slate-700" />

            {/* Mood */}
            <div className="space-y-4">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Mood Mix</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <SliderControl label="Reflective" value={mood.reflective} onChange={(v) => handleMoodChange('reflective', v)} disabled={disabled} />
                    <SliderControl label="Energetic" value={mood.energetic} onChange={(v) => handleMoodChange('energetic', v)} disabled={disabled} />
                    <SliderControl label="Serious" value={mood.serious} onChange={(v) => handleMoodChange('serious', v)} disabled={disabled} />
                    <SliderControl label="Inspiring" value={mood.inspiring} onChange={(v) => handleMoodChange('inspiring', v)} disabled={disabled} />
                    <SliderControl label="Urgent" value={mood.urgent} onChange={(v) => handleMoodChange('urgent', v)} disabled={disabled} />
                    <SliderControl label="Curious" value={mood.curious} onChange={(v) => handleMoodChange('curious', v)} disabled={disabled} />
                    <SliderControl label="Calm" value={mood.calm} onChange={(v) => handleMoodChange('calm', v)} disabled={disabled} />
                    <SliderControl label="Defiant" value={mood.defiant} onChange={(v) => handleMoodChange('defiant', v)} disabled={disabled} />
                </div>
            </div>

            <hr className="border-slate-200 dark:border-slate-700" />

            {/* Humor */}
            <div className="space-y-4 p-4 bg-slate-100 dark:bg-slate-900/40 rounded-lg">
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Humor Settings</h4>
                    <Switch
                        checked={humor.enabled || false}
                        onCheckedChange={(checked: boolean) => handleHumorChange('enabled', checked)}
                        disabled={disabled}
                    />
                </div>

                {humor.enabled && (
                    <div className="space-y-4 animate-in slide-in-from-top-2">
                        <SliderControl
                            label="Intensity"
                            subLabel="Smirk ↔ LOL"
                            value={humor.intensity}
                            onChange={(v) => handleHumorChange('intensity', v)}
                            disabled={disabled}
                        />

                        <div className="space-y-2">
                            <Label className="text-xs font-medium text-slate-500">Humor Types</Label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {HUMOR_TYPES_LIST.map(type => (
                                    <div key={type} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`humor-${type}`}
                                            checked={(humorTypes[type] || 0) > 0}
                                            onCheckedChange={() => toggleHumorType(type)}
                                            disabled={disabled}
                                        />
                                        <Label htmlFor={`humor-${type}`} className="capitalize cursor-pointer text-sm">
                                            {type.replace('_', ' ')}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Decoration */}
            <div className="grid grid-cols-2 gap-6 items-end">
                <div className="space-y-2">
                    <Label className="text-sm font-medium">Emoji Usage</Label>
                    <select
                        value={data.emojis || 'none'}
                        onChange={(e) => onChange({ ...data, emojis: e.target.value })}
                        disabled={disabled}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                    >
                        {EMOJI_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center justify-between p-2 border rounded-lg bg-white dark:bg-slate-900/50">
                    <Label className="text-sm font-medium cursor-pointer" htmlFor="short-p">Short Paragraphs</Label>
                    <Switch
                        id="short-p"
                        checked={data.short_paragraphs !== false} // Default true
                        onCheckedChange={(checked: boolean) => onChange({ ...data, short_paragraphs: checked })}
                        disabled={disabled}
                    />
                </div>
            </div>
        </div>
    );
}

// Reuse Slider Helper (duplicate for now to be self-contained or could move to utils)
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
                    className="flex-1 cursor-pointer accent-blue-500"
                />
                <span className="text-xs w-8 text-right font-mono text-slate-500">
                    {(value ?? 0).toFixed(1)}
                </span>
            </div>
        </div>
    );
}
