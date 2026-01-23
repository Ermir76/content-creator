import React from "react";
import { CustomSlider } from "@/components/ui/custom-slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { WritingStyleConfig } from "@/types/config";
import { cn } from "@/lib/utils";
import { PenLine, Palette, Compass, Smile, FileText, Ban, Minus, Plus, Sparkles } from "lucide-react";

interface StyleTabProps {
    config: WritingStyleConfig;
    onChange: (config: WritingStyleConfig) => void;
}

export const StyleTab: React.FC<StyleTabProps> = ({ config, onChange }) => {
    const updateStyle = (key: keyof WritingStyleConfig['style'], value: number) => {
        onChange({
            ...config,
            style: { ...config.style, [key]: value },
        });
    };

    const updateMood = (key: keyof WritingStyleConfig['mood'], value: number) => {
        onChange({
            ...config,
            mood: { ...config.mood, [key]: value },
        });
    };

    const updateApproach = (key: keyof WritingStyleConfig['approach'], value: number) => {
        onChange({
            ...config,
            approach: { ...config.approach, [key]: value },
        });
    };

    const updateHumorType = (key: keyof WritingStyleConfig['humor']['types'], value: number) => {
        onChange({
            ...config,
            humor: {
                ...config.humor,
                types: { ...config.humor.types, [key]: value },
            },
        });
    };

    return (
        <div className="space-y-6">
            {/* Writing Style */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <PenLine className="w-5 h-5 text-primary" />
                    <h4 className="font-display text-lg font-semibold text-foreground">
                        Writing Style
                    </h4>
                </div>

                <div className="space-y-4 pl-7">
                    <CustomSlider
                        label="Directness"
                        value={config.style.direct}
                        onChange={(v) => updateStyle("direct", v)}
                        leftLabel="Builds up"
                        rightLabel="Straight to point"
                    />
                    <CustomSlider
                        label="Casual Level"
                        value={config.style.casual}
                        onChange={(v) => updateStyle("casual", v)}
                        leftLabel="Formal"
                        rightLabel="Relaxed"
                    />
                </div>
            </div>

            {/* Mood */}
            <div className="space-y-5 pt-4 border-t border-border/50">
                <div className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-primary" />
                    <h4 className="font-display text-lg font-semibold text-foreground">
                        Mood Palette
                    </h4>
                </div>

                <div className="space-y-4 pl-7">
                    <CustomSlider
                        label="Reflective"
                        value={config.mood.reflective}
                        onChange={(v) => updateMood("reflective", v)}
                        leftLabel="Action-focused"
                        rightLabel="Introspective"
                    />
                    <CustomSlider
                        label="Energy"
                        value={config.mood.energetic}
                        onChange={(v) => updateMood("energetic", v)}
                        leftLabel="Calm"
                        rightLabel="High momentum"
                    />
                    <CustomSlider
                        label="Weight"
                        value={config.mood.serious}
                        onChange={(v) => updateMood("serious", v)}
                        leftLabel="Light"
                        rightLabel="Serious"
                    />
                    <CustomSlider
                        label="Inspiring"
                        value={config.mood.inspiring}
                        onChange={(v) => updateMood("inspiring", v)}
                        leftLabel="Grounded"
                        rightLabel="Uplifting"
                    />
                    <CustomSlider
                        label="Curiosity"
                        value={config.mood.curious}
                        onChange={(v) => updateMood("curious", v)}
                        leftLabel="Assertive"
                        rightLabel="Exploring"
                    />
                </div>
            </div>

            {/* Approach */}
            <div className="space-y-5 pt-4 border-t border-border/50">
                <div className="flex items-center gap-2">
                    <Compass className="w-5 h-5 text-primary" />
                    <h4 className="font-display text-lg font-semibold text-foreground">
                        Content Approach
                    </h4>
                </div>

                <div className="space-y-4 pl-7">
                    <CustomSlider
                        label="Storytelling"
                        value={config.approach.storytelling}
                        onChange={(v) => updateApproach("storytelling", v)}
                        leftLabel="Facts only"
                        rightLabel="Narrative"
                    />
                    <CustomSlider
                        label="Educational"
                        value={config.approach.educational}
                        onChange={(v) => updateApproach("educational", v)}
                        leftLabel="Entertainment"
                        rightLabel="Teaching"
                    />
                    <CustomSlider
                        label="Direct"
                        value={config.approach.direct}
                        onChange={(v) => updateApproach("direct", v)}
                        leftLabel="Exploratory"
                        rightLabel="To the point"
                    />
                </div>
            </div>

            {/* Humor */}
            <div className="space-y-5 pt-4 border-t border-border/50">
                <div className="flex items-center gap-2">
                    <Smile className="w-5 h-5 text-primary" />
                    <h4 className="font-display text-lg font-semibold text-foreground">
                        Humor Settings
                    </h4>
                </div>

                <div className="space-y-4 pl-7">
                    <div className={cn(
                        "flex items-center justify-between p-4 rounded-xl",
                        "bg-muted/30 border border-border/50"
                    )}>
                        <div>
                            <Label className="text-sm font-medium text-foreground">
                                Enable Humor
                            </Label>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Add wit and levity to content
                            </p>
                        </div>
                        <Switch
                            checked={config.humor.enabled}
                            onCheckedChange={(v) => onChange({ ...config, humor: { ...config.humor, enabled: v } })}
                        />
                    </div>

                    {config.humor.enabled && (
                        <>
                            <CustomSlider
                                label="Humor Intensity"
                                value={config.humor.intensity}
                                onChange={(v) => onChange({ ...config, humor: { ...config.humor, intensity: v } })}
                                leftLabel="Subtle"
                                rightLabel="Comedy show"
                            />
                            <CustomSlider
                                label="Dry Humor"
                                value={config.humor.types.dry}
                                onChange={(v) => updateHumorType("dry", v)}
                                leftLabel="None"
                                rightLabel="Deadpan"
                            />
                            <CustomSlider
                                label="Witty"
                                value={config.humor.types.witty}
                                onChange={(v) => updateHumorType("witty", v)}
                                leftLabel="Plain"
                                rightLabel="Wordplay"
                            />
                            <CustomSlider
                                label="Self-Deprecating"
                                value={config.humor.types.selfDeprecating}
                                onChange={(v) => updateHumorType("selfDeprecating", v)}
                                leftLabel="Confident"
                                rightLabel="Self-aware"
                            />
                        </>
                    )}
                </div>
            </div>

            {/* Format Options */}
            <div className="space-y-5 pt-4 border-t border-border/50">
                <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <h4 className="font-display text-lg font-semibold text-foreground">
                        Format Options
                    </h4>
                </div>

                <div className="space-y-4 pl-7">
                    <div className={cn(
                        "flex items-center justify-between p-4 rounded-xl",
                        "bg-muted/30 border border-border/50"
                    )}>
                        <div>
                            <Label className="text-sm font-medium text-foreground">
                                Short Paragraphs
                            </Label>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Break content into bite-sized chunks
                            </p>
                        </div>
                        <Switch
                            checked={config.shortParagraphs}
                            onCheckedChange={(v) => onChange({ ...config, shortParagraphs: v })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">
                            Emoji Usage
                        </Label>
                        <Select
                            value={config.emojis}
                            onValueChange={(v) => onChange({ ...config, emojis: v as WritingStyleConfig['emojis'] })}
                        >
                            <SelectTrigger className="w-full rounded-xl bg-muted/50 border-border/50 focus:ring-primary/30">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border rounded-xl">
                                <SelectItem value="none">
                                    <span className="flex items-center gap-2"><Ban className="w-4 h-4" /> None</span>
                                </SelectItem>
                                <SelectItem value="low">
                                    <span className="flex items-center gap-2"><Minus className="w-4 h-4" /> Low (1-2)</span>
                                </SelectItem>
                                <SelectItem value="mild">
                                    <span className="flex items-center gap-2"><Plus className="w-4 h-4" /> Mild (3-5)</span>
                                </SelectItem>
                                <SelectItem value="heavy">
                                    <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> Heavy (6+)</span>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </div>
    );
};
