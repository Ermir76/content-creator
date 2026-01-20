import { Label } from '@/components/ui/label';
import type { ModelRouting } from '@/types/policy';

interface ModelTabProps {
    data: ModelRouting;
    onChange: (data: ModelRouting) => void;
    disabled?: boolean;
}

export function ModelTab({ data, onChange, disabled }: ModelTabProps) {
    const pipeline = data.pipeline || {};

    const handlePipelineChange = (step: string, model: string) => {
        // If empty string, remove it to fallback to default
        const newPipeline = { ...pipeline, [step]: model };
        if (!model) {
            delete newPipeline[step];
        }
        onChange({ ...data, pipeline: newPipeline });
    };

    const MODELS = [
        { value: '', label: '(Default)' },
        { value: 'gemini-3-flash-preview', label: 'Gemini 3 Flash' },
        { value: 'gpt-5-mini', label: 'GPT-5 Mini' },
        { value: 'claude-haiku-4-5', label: 'Claude Haiku 4.5' },
        { value: 'grok-4-1-fast-reasoning', label: 'Grok 4.1 Fast' },
    ];

    return (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground mb-4">Pipeline Configuration</h4>

                <ModelSelector
                    label="Draft Generator"
                    description="Writes the initial content draft"
                    value={pipeline['generator'] || ''}
                    options={MODELS}
                    onChange={(val) => handlePipelineChange('generator', val)}
                    disabled={disabled}
                />

                <ModelSelector
                    label="Critique Agent"
                    description="Reviews the draft for policy violations"
                    value={pipeline['critic'] || ''}
                    options={MODELS}
                    onChange={(val) => handlePipelineChange('critic', val)}
                    disabled={disabled}
                />

                <ModelSelector
                    label="Improver Agent"
                    description="Refines the content based on critique"
                    value={pipeline['improver'] || ''}
                    options={MODELS}
                    onChange={(val) => handlePipelineChange('improver', val)}
                    disabled={disabled}
                />

                <ModelSelector
                    label="Judge Agent"
                    description="Final evaluation and scoring"
                    value={pipeline['judge'] || ''}
                    options={MODELS}
                    onChange={(val) => handlePipelineChange('judge', val)}
                    disabled={disabled}
                />
            </div>

            <div className="p-4 bg-secondary/20 rounded-lg text-xs text-foreground">
                <p>
                    <strong className="text-secondary">Note:</strong> Selecting specific models provides granular control but may impact generation cost and speed.
                    Leaving fields as "(Default)" uses the global system configuration.
                </p>
            </div>
        </div>
    );
}

// Helper Selector
function ModelSelector({ label, description, value, options, onChange, disabled }: {
    label: string,
    description: string,
    value: string,
    options: { value: string, label: string }[],
    onChange: (val: string) => void,
    disabled?: boolean
}) {
    return (
        <div className="flex items-center justify-between p-3 border rounded-lg bg-card hover:border-primary/50 transition-colors">
            <div className="space-y-0.5">
                <Label className="text-sm font-medium">{label}</Label>
                <p className="text-xs text-muted-foreground">{description}</p>
            </div>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="w-[200px] px-3 py-2 text-sm rounded-lg border border-border bg-input text-foreground"
            >
                {options.map((opt: any) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    );
}
