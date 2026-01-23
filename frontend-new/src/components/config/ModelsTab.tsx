import React from "react";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ModelsConfig } from "@/types/config";
import { cn } from "@/lib/utils";
import { Cpu, Workflow, Sparkles, Brain, PenTool, Lightbulb, Zap } from "lucide-react";

interface ModelsTabProps {
    config: ModelsConfig;
    onChange: (config: ModelsConfig) => void;
}

const modelOptions = [
    { value: 'gemini-3-flash-preview', label: 'Gemini 3 Flash', desc: 'Fast & versatile', icon: Sparkles },
    { value: 'gpt-5-mini', label: 'GPT-5 Mini', desc: 'Strong reasoning', icon: Brain },
    { value: 'claude-haiku-4-5', label: 'Claude Haiku 4.5', desc: 'Creative writing', icon: PenTool },
    { value: 'grok-4-1-fast-reasoning', label: 'Grok 4.1 Fast', desc: 'Fast reasoning', icon: Zap },
];

export const ModelsTab: React.FC<ModelsTabProps> = ({ config, onChange }) => {
    const updatePipeline = (key: keyof ModelsConfig['pipeline'], value: ModelsConfig['default']) => {
        onChange({
            ...config,
            pipeline: { ...config.pipeline, [key]: value },
        });
    };

    return (
        <div className="space-y-6">
            {/* Default Model */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-primary" />
                    <h4 className="font-display text-lg font-semibold text-foreground">
                        Default Model
                    </h4>
                </div>

                <div className="space-y-4 pl-7">
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">
                            Primary AI Engine
                        </Label>
                        <Select
                            value={config.default}
                            onValueChange={(v) => onChange({ ...config, default: v as ModelsConfig['default'] })}
                        >
                            <SelectTrigger className="w-full rounded-xl bg-muted/50 border-border/50 focus:ring-primary/30">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border rounded-xl">
                                {modelOptions.map((model) => {
                                    const Icon = model.icon;
                                    return (
                                        <SelectItem key={model.value} value={model.value}>
                                            <span className="flex items-center gap-2">
                                                <Icon className="w-4 h-4" /> {model.label} - {model.desc}
                                            </span>
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Pipeline Configuration */}
            <div className="space-y-5 pt-4 border-t border-border/50">
                <div className="flex items-center gap-2">
                    <Workflow className="w-5 h-5 text-primary" />
                    <h4 className="font-display text-lg font-semibold text-foreground">
                        Pipeline Configuration
                    </h4>
                </div>
                <p className="text-sm text-muted-foreground pl-7">
                    Choose different models for each stage of content generation
                </p>

                <div className="space-y-4 pl-7">
                    {/* Generator */}
                    <div className={cn(
                        "p-4 rounded-xl",
                        "bg-muted/30 border border-border/50"
                    )}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                                1
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-foreground">
                                    The Generator
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    Creates the initial draft
                                </p>
                            </div>
                        </div>
                        <Select
                            value={config.pipeline.generator}
                            onValueChange={(v) => updatePipeline("generator", v as ModelsConfig['default'])}
                        >
                            <SelectTrigger className="w-full rounded-xl bg-background border-border/50 focus:ring-primary/30">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border rounded-xl">
                                {modelOptions.map((model) => {
                                    const Icon = model.icon;
                                    return (
                                        <SelectItem key={model.value} value={model.value}>
                                            <span className="flex items-center gap-2"><Icon className="w-4 h-4" /> {model.label}</span>
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Critic */}
                    <div className={cn(
                        "p-4 rounded-xl",
                        "bg-muted/30 border border-border/50"
                    )}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                                2
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-foreground">
                                    The Critic
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    Reviews and identifies improvements
                                </p>
                            </div>
                        </div>
                        <Select
                            value={config.pipeline.critic}
                            onValueChange={(v) => updatePipeline("critic", v as ModelsConfig['default'])}
                        >
                            <SelectTrigger className="w-full rounded-xl bg-background border-border/50 focus:ring-primary/30">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border rounded-xl">
                                {modelOptions.map((model) => {
                                    const Icon = model.icon;
                                    return (
                                        <SelectItem key={model.value} value={model.value}>
                                            <span className="flex items-center gap-2"><Icon className="w-4 h-4" /> {model.label}</span>
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Improver */}
                    <div className={cn(
                        "p-4 rounded-xl",
                        "bg-muted/30 border border-border/50"
                    )}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                                3
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-foreground">
                                    The Improver
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    Refines and polishes the final output
                                </p>
                            </div>
                        </div>
                        <Select
                            value={config.pipeline.improver}
                            onValueChange={(v) => updatePipeline("improver", v as ModelsConfig['default'])}
                        >
                            <SelectTrigger className="w-full rounded-xl bg-background border-border/50 focus:ring-primary/30">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border rounded-xl">
                                {modelOptions.map((model) => {
                                    const Icon = model.icon;
                                    return (
                                        <SelectItem key={model.value} value={model.value}>
                                            <span className="flex items-center gap-2"><Icon className="w-4 h-4" /> {model.label}</span>
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Judge */}
                    <div className={cn(
                        "p-4 rounded-xl",
                        "bg-muted/30 border border-border/50"
                    )}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                                4
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-foreground">
                                    The Judge
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    Final evaluation and scoring
                                </p>
                            </div>
                        </div>
                        <Select
                            value={config.pipeline.judge}
                            onValueChange={(v) => updatePipeline("judge", v as ModelsConfig['default'])}
                        >
                            <SelectTrigger className="w-full rounded-xl bg-background border-border/50 focus:ring-primary/30">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border rounded-xl">
                                {modelOptions.map((model) => {
                                    const Icon = model.icon;
                                    return (
                                        <SelectItem key={model.value} value={model.value}>
                                            <span className="flex items-center gap-2"><Icon className="w-4 h-4" /> {model.label}</span>
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Info Note */}
            <div className="pt-4 border-t border-border/50">
                <div className={cn(
                    "p-4 rounded-xl flex items-start gap-3",
                    "bg-primary/5 border border-primary/20"
                )}>
                    <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                        <span className="text-primary font-medium">Pro tip:</span> Using different models at each stage can produce better results. Gemini excels at drafts, OpenAI at critique, and Claude at creative refinement.
                    </p>
                </div>
            </div>
        </div>
    );
};
