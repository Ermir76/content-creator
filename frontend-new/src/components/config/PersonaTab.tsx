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
import { PersonaConfig } from "@/types/config";
import { cn } from "@/lib/utils";
import { Mic, Sparkles, Gem, User, Users, UserCircle, Building2 } from "lucide-react";

interface PersonaTabProps {
    config: PersonaConfig;
    onChange: (config: PersonaConfig) => void;
}

export const PersonaTab: React.FC<PersonaTabProps> = ({ config, onChange }) => {
    const updatePersonality = (key: keyof PersonaConfig['personality'], value: number) => {
        onChange({
            ...config,
            personality: { ...config.personality, [key]: value },
        });
    };

    const updateAuthenticity = (key: keyof PersonaConfig['authenticity'], value: number) => {
        onChange({
            ...config,
            authenticity: { ...config.authenticity, [key]: value },
        });
    };

    return (
        <div className="space-y-6">
            {/* Perspective */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Mic className="w-5 h-5 text-primary" />
                    <h4 className="font-display text-lg font-semibold text-foreground">
                        Voice & Perspective
                    </h4>
                </div>

                <div className="space-y-4 pl-7">
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">
                            Speaking As...
                        </Label>
                        <Select
                            value={config.perspective}
                            onValueChange={(v) => onChange({ ...config, perspective: v as PersonaConfig['perspective'] })}
                        >
                            <SelectTrigger className="w-full rounded-xl bg-muted/50 border-border/50 focus:ring-primary/30">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border rounded-xl">
                                <SelectItem value="first-person">
                                    <span className="flex items-center gap-2"><User className="w-4 h-4" /> First Person (I, me, my)</span>
                                </SelectItem>
                                <SelectItem value="second-person">
                                    <span className="flex items-center gap-2"><UserCircle className="w-4 h-4" /> Second Person (you, your)</span>
                                </SelectItem>
                                <SelectItem value="third-person">
                                    <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Third Person (they, them)</span>
                                </SelectItem>
                                <SelectItem value="we">
                                    <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Collective (we, our)</span>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className={cn(
                        "flex items-center justify-between p-4 rounded-xl",
                        "bg-muted/30 border border-border/50"
                    )}>
                        <div>
                            <Label className="text-sm font-medium text-foreground">
                                Corporate Voice
                            </Label>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Brand-safe, polished tone
                            </p>
                        </div>
                        <Switch
                            checked={config.corporate}
                            onCheckedChange={(v) => onChange({ ...config, corporate: v })}
                        />
                    </div>
                </div>
            </div>

            {/* Personality */}
            <div className="space-y-5 pt-4 border-t border-border/50">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <h4 className="font-display text-lg font-semibold text-foreground">
                        Personality Essence
                    </h4>
                </div>

                <div className="space-y-4 pl-7">
                    <CustomSlider
                        label="Human Touch"
                        value={config.personality.human}
                        onChange={(v) => updatePersonality("human", v)}
                        leftLabel="Mechanical"
                        rightLabel="Soulful"
                    />
                    <CustomSlider
                        label="Professionalism"
                        value={config.personality.professional}
                        onChange={(v) => updatePersonality("professional", v)}
                        leftLabel="Casual"
                        rightLabel="Executive"
                    />
                    <CustomSlider
                        label="Warmth"
                        value={config.personality.friendly}
                        onChange={(v) => updatePersonality("friendly", v)}
                        leftLabel="Cool"
                        rightLabel="Cozy"
                    />
                    <CustomSlider
                        label="Vulnerability"
                        value={config.personality.vulnerable}
                        onChange={(v) => updatePersonality("vulnerable", v)}
                        leftLabel="Guarded"
                        rightLabel="Open heart"
                    />
                    <CustomSlider
                        label="Spice Level"
                        value={config.personality.provocative}
                        onChange={(v) => updatePersonality("provocative", v)}
                        leftLabel="Mild"
                        rightLabel="Fire"
                    />
                    <CustomSlider
                        label="Opinion Strength"
                        value={config.personality.opinionated}
                        onChange={(v) => updatePersonality("opinionated", v)}
                        leftLabel="Neutral"
                        rightLabel="Bold takes"
                    />
                </div>
            </div>

            {/* Authenticity */}
            <div className="space-y-5 pt-4 border-t border-border/50">
                <div className="flex items-center gap-2">
                    <Gem className="w-5 h-5 text-primary" />
                    <h4 className="font-display text-lg font-semibold text-foreground">
                        Authenticity Crystals
                    </h4>
                </div>

                <div className="space-y-4 pl-7">
                    <CustomSlider
                        label="Truth Serum"
                        value={config.authenticity.honest}
                        onChange={(v) => updateAuthenticity("honest", v)}
                        leftLabel="Diplomatic"
                        rightLabel="Blunt"
                    />
                    <CustomSlider
                        label="Polish Level"
                        value={config.authenticity.polished}
                        onChange={(v) => updateAuthenticity("polished", v)}
                        leftLabel="Rough"
                        rightLabel="Refined"
                    />
                    <CustomSlider
                        label="Raw Energy"
                        value={config.authenticity.raw}
                        onChange={(v) => updateAuthenticity("raw", v)}
                        leftLabel="Filtered"
                        rightLabel="Uncut"
                    />
                </div>
            </div>
        </div>
    );
};
