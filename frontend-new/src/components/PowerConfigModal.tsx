import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PowerUserConfig } from "@/types/config";
import { PersonaTab } from "@/components/config/PersonaTab";
import { StyleTab } from "@/components/config/StyleTab";
import { FormatTab } from "@/components/config/FormatTab";
import { ModelsTab } from "@/components/config/ModelsTab";
import { FlaskConical, User, Palette, LayoutTemplate, Cpu } from "lucide-react";

interface PowerConfigModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    platform: string;
    config: PowerUserConfig;
    onConfigChange: (config: PowerUserConfig) => void;
}

export const PowerConfigModal: React.FC<PowerConfigModalProps> = ({
    open,
    onOpenChange,
    platform,
    config,
    onConfigChange,
}) => {
    const [activeTab, setActiveTab] = useState("persona");

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] recipe-card rounded-3xl p-0 overflow-hidden border-0 max-h-[90vh]">
                {/* Header */}
                <DialogHeader className="px-8 pt-8 pb-6 border-b border-border/50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center">
                            <FlaskConical className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                                Master Recipe for
                            </p>
                            <DialogTitle className="font-display text-2xl font-bold text-primary">
                                {platform} Elixir
                            </DialogTitle>
                        </div>
                    </div>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="w-full justify-start px-8 py-3 bg-transparent border-b border-border/50 rounded-none h-auto gap-2 overflow-x-auto">
                        <TabsTrigger value="persona" className="recipe-tab flex items-center gap-1.5">
                            <User className="w-4 h-4" /> Persona
                        </TabsTrigger>
                        <TabsTrigger value="style" className="recipe-tab flex items-center gap-1.5">
                            <Palette className="w-4 h-4" /> Style
                        </TabsTrigger>
                        <TabsTrigger value="format" className="recipe-tab flex items-center gap-1.5">
                            <LayoutTemplate className="w-4 h-4" /> Format
                        </TabsTrigger>
                        <TabsTrigger value="models" className="recipe-tab flex items-center gap-1.5">
                            <Cpu className="w-4 h-4" /> Models
                        </TabsTrigger>
                    </TabsList>

                    <div className="p-8 max-h-[50vh] overflow-y-auto">
                        <TabsContent value="persona" className="mt-0">
                            <PersonaTab
                                config={config.persona}
                                onChange={(persona) => onConfigChange({ ...config, persona })}
                            />
                        </TabsContent>

                        <TabsContent value="style" className="mt-0">
                            <StyleTab
                                config={config.style}
                                onChange={(style) => onConfigChange({ ...config, style })}
                            />
                        </TabsContent>

                        <TabsContent value="format" className="mt-0">
                            <FormatTab
                                config={config.format}
                                onChange={(format) => onConfigChange({ ...config, format })}
                            />
                        </TabsContent>

                        <TabsContent value="models" className="mt-0">
                            <ModelsTab
                                config={config.models}
                                onChange={(models) => onConfigChange({ ...config, models })}
                            />
                        </TabsContent>
                    </div>
                </Tabs>

                {/* Footer */}
                <div className="px-8 py-4 border-t border-border/50 flex justify-center">
                    <p className="text-xs text-muted-foreground italic">
                        ~ Power User Mode: Full control over your content alchemy ~
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
};
