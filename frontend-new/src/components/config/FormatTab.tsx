import React from "react";
import { CustomSlider } from "@/components/ui/custom-slider";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FormatConfig } from "@/types/config";
import { cn } from "@/lib/utils";
import { Target, Fish, FileText, Flag, AlignLeft, BarChart3, BookOpen, Zap } from "lucide-react";

interface FormatTabProps {
    config: FormatConfig;
    onChange: (config: FormatConfig) => void;
}

export const FormatTab: React.FC<FormatTabProps> = ({ config, onChange }) => {
    const updateHook = (key: keyof FormatConfig['hook'], value: number) => {
        onChange({
            ...config,
            hook: { ...config.hook, [key]: value },
        });
    };

    const updateTexture = (key: keyof FormatConfig['body']['texture'], value: number) => {
        onChange({
            ...config,
            body: { ...config.body, texture: { ...config.body.texture, [key]: value } },
        });
    };

    const updateEnding = (key: keyof FormatConfig['ending'], value: number) => {
        onChange({
            ...config,
            ending: { ...config.ending, [key]: value },
        });
    };

    return (
        <div className="space-y-6">
            {/* Length & Constraints */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    <h4 className="font-display text-lg font-semibold text-foreground">
                        Length & Constraints
                    </h4>
                </div>

                <div className="space-y-4 pl-7">
                    <CustomSlider
                        label="Target Length"
                        value={config.targetLength}
                        onChange={(v) => onChange({ ...config, targetLength: v })}
                        min={100}
                        max={2000}
                        step={50}
                        formatValue={(v) => `${v} chars`}
                    />
                    <CustomSlider
                        label="Hashtags"
                        value={config.hashtags}
                        onChange={(v) => onChange({ ...config, hashtags: v })}
                        min={0}
                        max={30}
                        step={1}
                        formatValue={(v) => `${v}`}
                    />
                </div>
            </div>

            {/* Hook Strategy */}
            <div className="space-y-5 pt-4 border-t border-border/50">
                <div className="flex items-center gap-2">
                    <Fish className="w-5 h-5 text-primary" />
                    <h4 className="font-display text-lg font-semibold text-foreground">
                        Hook Strategy
                    </h4>
                </div>

                <div className="space-y-4 pl-7">
                    <CustomSlider
                        label="Punchy Opening"
                        value={config.hook.punchy}
                        onChange={(v) => updateHook("punchy", v)}
                        leftLabel="Gentle"
                        rightLabel="Impactful"
                    />
                    <CustomSlider
                        label="Question Hook"
                        value={config.hook.question}
                        onChange={(v) => updateHook("question", v)}
                        leftLabel="Statement"
                        rightLabel="Engaging question"
                    />
                    <CustomSlider
                        label="Story Opening"
                        value={config.hook.story}
                        onChange={(v) => updateHook("story", v)}
                        leftLabel="Facts"
                        rightLabel="Narrative"
                    />
                    <CustomSlider
                        label="Bold Claim"
                        value={config.hook.boldClaim}
                        onChange={(v) => updateHook("boldClaim", v)}
                        leftLabel="Safe"
                        rightLabel="Provocative"
                    />
                </div>
            </div>

            {/* Body Structure */}
            <div className="space-y-5 pt-4 border-t border-border/50">
                <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <h4 className="font-display text-lg font-semibold text-foreground">
                        Body & Structure
                    </h4>
                </div>

                <div className="space-y-4 pl-7">
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">
                            Content Structure
                        </Label>
                        <Select
                            value={config.body.type}
                            onValueChange={(v) => onChange({ ...config, body: { ...config.body, type: v as FormatConfig['body']['type'] } })}
                        >
                            <SelectTrigger className="w-full rounded-xl bg-muted/50 border-border/50 focus:ring-primary/30">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border rounded-xl">
                                <SelectItem value="honest-experience">
                                    <span className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> Honest Experience</span>
                                </SelectItem>
                                <SelectItem value="how-to">
                                    <span className="flex items-center gap-2"><AlignLeft className="w-4 h-4" /> How-To Guide</span>
                                </SelectItem>
                                <SelectItem value="list">
                                    <span className="flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Listicle</span>
                                </SelectItem>
                                <SelectItem value="story">
                                    <span className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> Narrative Story</span>
                                </SelectItem>
                                <SelectItem value="analysis">
                                    <span className="flex items-center gap-2"><Zap className="w-4 h-4" /> Deep Analysis</span>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <CustomSlider
                        label="Examples"
                        value={config.body.texture.examples}
                        onChange={(v) => updateTexture("examples", v)}
                        leftLabel="Minimal"
                        rightLabel="Rich examples"
                    />
                    <CustomSlider
                        label="Data Points"
                        value={config.body.texture.data}
                        onChange={(v) => updateTexture("data", v)}
                        leftLabel="Anecdotal"
                        rightLabel="Data-driven"
                    />
                    <CustomSlider
                        label="Analogies"
                        value={config.body.texture.analogy}
                        onChange={(v) => updateTexture("analogy", v)}
                        leftLabel="Literal"
                        rightLabel="Metaphorical"
                    />
                </div>
            </div>

            {/* Ending */}
            <div className="space-y-5 pt-4 border-t border-border/50">
                <div className="flex items-center gap-2">
                    <Flag className="w-5 h-5 text-primary" />
                    <h4 className="font-display text-lg font-semibold text-foreground">
                        Ending & CTA
                    </h4>
                </div>

                <div className="space-y-4 pl-7">
                    <CustomSlider
                        label="Question Ending"
                        value={config.ending.oneQuestion}
                        onChange={(v) => updateEnding("oneQuestion", v)}
                        leftLabel="Closed"
                        rightLabel="Open question"
                    />
                    <CustomSlider
                        label="Call to Action"
                        value={config.ending.callToAction}
                        onChange={(v) => updateEnding("callToAction", v)}
                        leftLabel="Passive"
                        rightLabel="Strong CTA"
                    />
                    <CustomSlider
                        label="Cliffhanger"
                        value={config.ending.cliffhanger}
                        onChange={(v) => updateEnding("cliffhanger", v)}
                        leftLabel="Resolved"
                        rightLabel="Suspenseful"
                    />
                </div>
            </div>
        </div>
    );
};
