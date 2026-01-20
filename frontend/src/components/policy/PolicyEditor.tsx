import { useState } from 'react';
import type { PolicyOverride } from '@/types/policy';
import { User, Palette, FileJson, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PersonaTab } from './PersonaTab';
import { StyleTab } from './StyleTab';
import { FormatTab } from './FormatTab';
import { ModelTab } from './ModelTab';

interface PolicyEditorProps {
    policy: PolicyOverride;
    onChange: (policy: PolicyOverride) => void;
    disabled?: boolean;
    platform?: string;
}

type Tab = 'persona' | 'style' | 'format' | 'models';

export function PolicyEditor({ policy, onChange, disabled, platform }: PolicyEditorProps) {
    const [activeTab, setActiveTab] = useState<Tab>('persona');

    const handleTabChange = (tab: Tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="bg-muted/30 rounded-lg border border-border overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex border-b border-border bg-muted/50">
                <TabButton
                    active={activeTab === 'persona'}
                    onClick={() => handleTabChange('persona')}
                    icon={<User className="w-4 h-4" />}
                    label="Persona"
                    disabled={disabled}
                />
                <TabButton
                    active={activeTab === 'style'}
                    onClick={() => handleTabChange('style')}
                    icon={<Palette className="w-4 h-4" />}
                    label="Style"
                    disabled={disabled}
                />
                <TabButton
                    active={activeTab === 'format'}
                    onClick={() => handleTabChange('format')}
                    icon={<FileJson className="w-4 h-4" />}
                    label="Format"
                    disabled={disabled}
                />
                <TabButton
                    active={activeTab === 'models'}
                    onClick={() => handleTabChange('models')}
                    icon={<Cpu className="w-4 h-4" />}
                    label="Models"
                    disabled={disabled}
                />
            </div>

            {/* Tab Content */}
            <div className="p-4">
                {activeTab === 'persona' && (
                    <PersonaTab
                        data={policy.author_persona || {}}
                        onChange={(newPersona) => onChange({ ...policy, author_persona: newPersona })}
                        disabled={disabled}
                    />
                )}
                {activeTab === 'style' && (
                    <StyleTab
                        data={policy.writing_style || {}}
                        onChange={(newStyle) => onChange({ ...policy, writing_style: newStyle })}
                        disabled={disabled}
                    />
                )}
                {activeTab === 'format' && (
                    <FormatTab
                        data={policy.format || {}}
                        constraints={policy.constraints || {}}
                        onChange={(newFormat) => onChange({ ...policy, format: newFormat })}
                        onConstraintsChange={(newConstraints) => onChange({ ...policy, constraints: newConstraints })}
                        disabled={disabled}
                        platform={platform}
                    />
                )}
                {activeTab === 'models' && (
                    <ModelTab
                        data={policy.models || {}}
                        onChange={(newModels) => onChange({ ...policy, models: newModels })}
                        disabled={disabled}
                    />
                )}
            </div>
        </div>
    );
}

// Helper Component for Tabs
function TabButton({ active, onClick, icon, label, disabled }: any) {
    return (
        <Button
            type="button"
            variant="ghost"
            onClick={onClick}
            disabled={disabled}
            className={`flex-1 justify-center rounded-none h-auto py-3 gap-2 border-b-2 hover:bg-transparent
                ${active
                    ? 'border-primary text-primary bg-card'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }
            `}
        >
            {icon}
            {label}
        </Button>
    );
}
