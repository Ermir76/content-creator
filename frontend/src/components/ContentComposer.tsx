import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Briefcase, MessageSquare, Camera, Sparkles, ThumbsUp, Music, ChevronDown, ChevronUp, Settings2 } from 'lucide-react';
import { toast } from 'sonner';
import type { LucideIcon } from 'lucide-react';
import { PolicyControls } from './PolicyControls';
import type { PolicyOverride, PlatformPolicies } from '@/types/policy';

interface Platform {
  id: string;
  name: string;
  icon: LucideIcon;
}

const PLATFORMS: Platform[] = [
  { id: 'linkedin', name: 'LinkedIn', icon: Briefcase },
  { id: 'twitter', name: 'Twitter', icon: MessageSquare },
  { id: 'reddit', name: 'Reddit', icon: MessageSquare },
  { id: 'instagram', name: 'Instagram', icon: Camera },
  { id: 'facebook', name: 'Facebook', icon: ThumbsUp },
  { id: 'tiktok', name: 'TikTok', icon: Music },
];

interface ContentComposerProps {
  onGenerate: (ideaPrompt: string, platforms: string[], platformPolicies: PlatformPolicies) => void;
  isLoading: boolean;
}

export function ContentComposer({ onGenerate, isLoading }: ContentComposerProps) {
  const [ideaPrompt, setIdeaPrompt] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [expandedPlatforms, setExpandedPlatforms] = useState<string[]>([]);
  const [platformPolicies, setPlatformPolicies] = useState<PlatformPolicies>({});
  const [showValidation, setShowValidation] = useState(false);

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => {
      if (prev.includes(platformId)) {
        // When unchecking, also collapse the settings
        setExpandedPlatforms(exp => exp.filter(id => id !== platformId));
        return prev.filter(id => id !== platformId);
      } else {
        return [...prev, platformId];
      }
    });
    setShowValidation(false);
  };

  const handleToggleExpand = (platformId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handlePolicyChange = (platformId: string, policy: PolicyOverride) => {
    setPlatformPolicies(prev => ({
      ...prev,
      [platformId]: policy,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!ideaPrompt.trim()) {
      setShowValidation(true);
      toast.error('Missing idea', {
        description: 'Please enter an idea for your post'
      });
      return;
    }

    if (selectedPlatforms.length === 0) {
      setShowValidation(true);
      toast.error('No platform selected', {
        description: 'Please select at least one platform'
      });
      return;
    }

    setShowValidation(false);

    // Only send policies for selected platforms that have custom settings
    const activePolicies: PlatformPolicies = {};
    for (const platformId of selectedPlatforms) {
      if (platformPolicies[platformId] && Object.keys(platformPolicies[platformId]).length > 0) {
        activePolicies[platformId] = platformPolicies[platformId];
      }
    }

    onGenerate(ideaPrompt, selectedPlatforms, activePolicies);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-2xl">
      <CardHeader>
        <CardTitle className="text-2xl">Create Your Content</CardTitle>
        <CardDescription>
          Describe your idea and select platforms to generate AI-powered content
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Idea Input */}
          <div className="space-y-2">
            <Label htmlFor="idea-prompt" className="text-base font-semibold">
              What's your idea?
            </Label>
            <Textarea
              id="idea-prompt"
              placeholder="E.g., Share tips about staying productive while working from home..."
              value={ideaPrompt}
              onChange={(e) => {
                setIdeaPrompt(e.target.value);
                setShowValidation(false);
              }}
              className={`min-h-[120px] resize-none transition-colors ${showValidation && !ideaPrompt.trim()
                ? 'border-destructive focus-visible:ring-destructive'
                : ''
                }`}
              disabled={isLoading}
            />
            {showValidation && !ideaPrompt.trim() && (
              <p className="text-sm text-destructive">This field is required</p>
            )}
          </div>

          {/* Platform Selection with Expandable Settings */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              Select Platforms
            </Label>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Click the settings icon to customize each platform's output
            </p>
            <div className={`space-y-3 transition-all ${showValidation && selectedPlatforms.length === 0
              ? 'ring-2 ring-destructive/50 rounded-lg p-2'
              : ''
              }`}>
              {PLATFORMS.map((platform) => {
                const Icon = platform.icon;
                const isSelected = selectedPlatforms.includes(platform.id);
                const isExpanded = expandedPlatforms.includes(platform.id);

                return (
                  <div
                    key={platform.id}
                    className={`rounded-lg border transition-all ${isSelected
                        ? 'border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-900/20'
                        : 'hover:bg-accent'
                      }`}
                  >
                    {/* Platform Header */}
                    <div className="flex items-center justify-between p-3">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id={platform.id}
                          checked={isSelected}
                          onCheckedChange={() => handlePlatformToggle(platform.id)}
                          disabled={isLoading}
                        />
                        <Label
                          htmlFor={platform.id}
                          className="flex items-center gap-2 cursor-pointer flex-1"
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{platform.name}</span>
                        </Label>
                      </div>

                      {/* Settings Toggle Button - Only show when selected */}
                      {isSelected && (
                        <button
                          type="button"
                          onClick={(e) => handleToggleExpand(platform.id, e)}
                          className="flex items-center gap-1 px-2 py-1 text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                          disabled={isLoading}
                        >
                          <Settings2 className="w-4 h-4" />
                          <span className="hidden sm:inline">Customize</span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Collapsible Policy Controls */}
                    {isSelected && isExpanded && (
                      <div className="px-3 pb-3 animate-in slide-in-from-top-2 duration-200">
                        <PolicyControls
                          policy={platformPolicies[platform.id] || {}}
                          onChange={(policy) => handlePolicyChange(platform.id, policy)}
                          disabled={isLoading}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {showValidation && selectedPlatforms.length === 0 && (
              <p className="text-sm text-destructive">Please select at least one platform</p>
            )}
          </div>

          {/* Generate Button */}
          <Button
            type="submit"
            className="w-full text-lg py-6"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating Content...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Generate Content
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
