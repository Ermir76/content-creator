import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Briefcase, MessageSquare, Camera, Sparkles, ThumbsUp, Music, Settings2, Eye, X } from 'lucide-react';
import { toast } from 'sonner';
import type { LucideIcon } from 'lucide-react';
import { PolicyEditor } from './policy/PolicyEditor';
import type { PolicyOverride, PlatformPolicies } from '@/types/policy';
import { contentApi, type PlatformPromptPreview } from '@/services/contentApi';
import { useDebounce } from '@/hooks/useDebounce';
import { Modal } from '@/components/ui/modal';

export interface Platform {
  id: string;
  name: string;
  icon: LucideIcon;
}

export const PLATFORMS: Platform[] = [
  { id: 'linkedin', name: 'LinkedIn', icon: Briefcase },
  { id: 'x', name: 'X', icon: MessageSquare },
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
  const [editingPlatformId, setEditingPlatformId] = useState<string | null>(null);
  const [platformPolicies, setPlatformPolicies] = useState<PlatformPolicies>({});
  const [showValidation, setShowValidation] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [promptPreviews, setPromptPreviews] = useState<PlatformPromptPreview[]>([]);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  // Baseline snapshot ref - tracks last saved state to prevent unnecessary saves
  const baselineRef = useRef<string | null>(null);

  // Debounce values for auto-saving
  const debouncedIdea = useDebounce(ideaPrompt, 1000);
  const debouncedPlatforms = useDebounce(selectedPlatforms, 1000);
  const debouncedPolicies = useDebounce(platformPolicies, 1000);
  // const debouncedExpanded = useDebounce(expandedPlatforms, 1000);

  // Load preferences on mount
  useEffect(() => {
    async function loadPreferences() {
      try {
        const prefs = await contentApi.getPreferences();
        if (prefs) {
          if (prefs.last_idea_prompt) setIdeaPrompt(prefs.last_idea_prompt);
          if (prefs.last_platform_selection) {
            const saved = JSON.parse(prefs.last_platform_selection);
            // Filter out stale platforms (like 'twitter' if we renamed to 'x')
            const valid = saved.filter((id: string) => PLATFORMS.some(p => p.id === id));
            setSelectedPlatforms(valid);
          }
          if (prefs.last_policies) setPlatformPolicies(JSON.parse(prefs.last_policies));
          // expandedPlatforms is removed, we don't persist open modals usually, or we could if we want.
          // Ignoring last_expanded_platforms for now to simplify.
        }
      } catch (error) {
        console.error('Failed to load preferences:', error);
      } finally {
        setIsLoaded(true);
      }
    }
    loadPreferences();
  }, []);

  // Save preferences when changed (with baseline comparison to prevent race conditions)
  useEffect(() => {
    if (!isLoaded) return;

    // Create snapshot of current debounced values
    const currentSnapshot = JSON.stringify({
      idea: debouncedIdea,
      platforms: debouncedPlatforms,
      policies: debouncedPolicies,
    });

    // First run after load: establish baseline, don't save
    if (baselineRef.current === null) {
      baselineRef.current = currentSnapshot;
      return;
    }

    // If values unchanged from baseline, skip save
    if (currentSnapshot === baselineRef.current) {
      return;
    }

    // Values changed - update baseline and save
    baselineRef.current = currentSnapshot;

    const saveData = {
      last_idea_prompt: debouncedIdea,
      last_platform_selection: JSON.stringify(debouncedPlatforms),
      last_policies: JSON.stringify(debouncedPolicies),
    };

    contentApi.updatePreferences(saveData).catch(err => console.error('Failed to save preferences:', err));
  }, [debouncedIdea, debouncedPlatforms, debouncedPolicies, isLoaded]);

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => {
      if (prev.includes(platformId)) {
        // When unchecking, also collapse the settings if it's the one open
        if (editingPlatformId === platformId) {
          setEditingPlatformId(null);
        }
        return prev.filter(id => id !== platformId);
      } else {
        return [...prev, platformId];
      }
    });
    setShowValidation(false);
  };

  const handleOpenSettings = (platformId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPlatformId(platformId);
  };

  const handleCloseSettings = () => {
    setEditingPlatformId(null);
  };

  const handlePolicyChange = (platformId: string, policy: PolicyOverride) => {
    setPlatformPolicies(prev => ({
      ...prev,
      [platformId]: policy,
    }));
  };

  const validateInputs = (): boolean => {
    if (!ideaPrompt.trim()) {
      setShowValidation(true);
      toast.error('Missing idea', {
        description: 'Please enter an idea for your post'
      });
      return false;
    }

    if (selectedPlatforms.length === 0) {
      setShowValidation(true);
      toast.error('No platform selected', {
        description: 'Please select at least one platform'
      });
      return false;
    }

    setShowValidation(false);
    return true;
  };

  const getActivePolicies = (): PlatformPolicies => {
    const activePolicies: PlatformPolicies = {};
    for (const platformId of selectedPlatforms) {
      if (platformPolicies[platformId] && Object.keys(platformPolicies[platformId]).length > 0) {
        activePolicies[platformId] = platformPolicies[platformId];
      }
    }
    return activePolicies;
  };

  const handlePreviewPrompt = async () => {
    if (!validateInputs()) return;

    setIsLoadingPreview(true);
    try {
      const response = await contentApi.previewPrompt({
        idea_prompt: ideaPrompt,
        platforms: selectedPlatforms,
        platform_policies: getActivePolicies(),
      });
      setPromptPreviews(response.previews);
    } catch (error) {
      console.error('Failed to preview prompt:', error);
      toast.error('Failed to preview prompt');
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;
    onGenerate(ideaPrompt, selectedPlatforms, getActivePolicies());
  };

  return (
    <div className="w-full space-y-8">
      {/* 1. INPUT CARD */}
      <Card className="shadow-xl border-slate-200 dark:border-slate-800">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Idea Input */}
            <div className="space-y-2">
              <Label htmlFor="idea-prompt" className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
                What's your idea?
              </Label>
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 min-h-[180px] border border-slate-100 dark:border-slate-800 shadow-inner">
                <Textarea
                  id="idea-prompt"
                  placeholder="E.g., Share tips about staying productive while working from home..."
                  value={ideaPrompt}
                  onChange={(e) => {
                    setIdeaPrompt(e.target.value);
                    setShowValidation(false);
                  }}
                  className={`w-full h-full bg-transparent border-none focus-visible:ring-0 text-lg resize-none p-0 placeholder:text-slate-400 ${showValidation && !ideaPrompt.trim() ? 'placeholder:text-red-400' : ''}`}
                  disabled={isLoading}
                />
              </div>
              {showValidation && !ideaPrompt.trim() && (
                <p className="text-sm text-destructive pl-1">This field is required</p>
              )}
            </div>


          </form>
        </CardContent>
      </Card>

      {/* 2. ACTION BUTTONS (Separate Row) */}
      <div className="flex gap-6">
        <Button
          type="button"
          onClick={handlePreviewPrompt}
          disabled={isLoading || isLoadingPreview}
          variant="secondary"
          className="flex-1 py-6 text-base font-bold uppercase tracking-wide bg-orange-100 text-orange-900 hover:bg-orange-200 dark:bg-orange-900/20 dark:text-orange-100 dark:hover:bg-orange-900/40 border border-orange-200 dark:border-orange-800"
        >
          {isLoadingPreview ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Wait...
            </>
          ) : (
            <>
              <Eye className="mr-2 h-5 w-5" />
              Preview Prompt
            </>
          )}
        </Button>
        <Button
          onClick={handleSubmit} // Trigger form submit manually since it's outside form
          disabled={isLoading || isLoadingPreview}
          className="flex-1 py-6 text-base font-bold uppercase tracking-wide bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-lg shadow-blue-900/20"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Generate
            </>
          )}
        </Button>
      </div>

      {/* 2. PLATFORM GRID (Sibling) */}
      <div className="space-y-3">
        <Label className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
          Select Platforms
        </Label>
        <div className={`grid grid-cols-2 lg:grid-cols-3 gap-6 transition-all ${showValidation && selectedPlatforms.length === 0 ? 'ring-2 ring-destructive/50 rounded-xl p-2' : ''}`}>
          {PLATFORMS.map((platform) => {
            const Icon = platform.icon;
            const isSelected = selectedPlatforms.includes(platform.id);
            // const isExpanded = expandedPlatforms.includes(platform.id); // Removed logic

            return (
              <div
                key={platform.id}
                className={`relative cursor-pointer group flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border-2 transition-all duration-300 ${isSelected
                  ? 'bg-white dark:bg-slate-800 border-blue-500 shadow-xl scale-105 z-10'
                  : 'bg-white/40 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:scale-105 hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg'
                  }`}
                onClick={() => handlePlatformToggle(platform.id)}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md transition-colors ${isSelected
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-slate-300 dark:group-hover:bg-slate-700'
                  }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className={`font-extrabold text-lg ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'
                  }`}>
                  {platform.name}
                </span>

                {/* Settings Toggle */
                  isSelected && (
                    <button
                      type="button"
                      onClick={(e) => handleOpenSettings(platform.id, e)}
                      className="absolute top-3 right-3 p-2 text-slate-300 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-all"
                    >
                      <Settings2 className="w-5 h-5" />
                    </button>
                  )}

                {/* No inline PolicyEditor here anymore */}
              </div>
            );
          })}
        </div>
        {showValidation && selectedPlatforms.length === 0 && (
          <p className="text-sm text-destructive pl-1">Please select at least one platform</p>
        )}
      </div>

      {/* Prompt Preview Overlay */}
      {promptPreviews.length > 0 && (
        <Card className="animate-in slide-in-from-top-4 border-blue-200 dark:border-blue-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg text-blue-800 dark:text-blue-300">Prompt Previews</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setPromptPreviews([])}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[400px] overflow-y-auto">
            {promptPreviews.map((preview) => (
              <div key={preview.platform} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800">
                <div className="font-bold text-blue-600 dark:text-blue-400 text-xs uppercase mb-2 tracking-wider">{preview.platform}</div>
                <pre className="whitespace-pre-wrap text-sm font-mono text-slate-600 dark:text-slate-400">
                  {preview.prompt}
                </pre>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* 4. MODAL FOR SETTINGS */}
      <Modal
        isOpen={!!editingPlatformId}
        onClose={handleCloseSettings}
        title={editingPlatformId ? `Customize ${PLATFORMS.find(p => p.id === editingPlatformId)?.name} Settings` : ''}
        description="Adjust how the AI generates content for this platform."
        className="max-w-3xl"
      >
        {editingPlatformId && (
          <PolicyEditor
            policy={platformPolicies[editingPlatformId] || {}}
            onChange={(policy: PolicyOverride) => handlePolicyChange(editingPlatformId, policy)}
            disabled={isLoading}
            platform={editingPlatformId}
          />
        )}
      </Modal>
    </div>
  );
}
