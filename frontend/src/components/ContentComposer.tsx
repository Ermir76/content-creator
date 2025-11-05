import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Briefcase, MessageSquare, Camera, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import type { LucideIcon } from 'lucide-react';

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
];

interface ContentComposerProps {
  onGenerate: (ideaPrompt: string, platforms: string[]) => void;
  isLoading: boolean;
}

export function ContentComposer({ onGenerate, isLoading }: ContentComposerProps) {
  const [ideaPrompt, setIdeaPrompt] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [showValidation, setShowValidation] = useState(false);

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
    setShowValidation(false);
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
    onGenerate(ideaPrompt, selectedPlatforms);
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
              className={`min-h-[120px] resize-none transition-colors ${
                showValidation && !ideaPrompt.trim() 
                  ? 'border-destructive focus-visible:ring-destructive' 
                  : ''
              }`}
              disabled={isLoading}
            />
            {showValidation && !ideaPrompt.trim() && (
              <p className="text-sm text-destructive">This field is required</p>
            )}
          </div>

          {/* Platform Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              Select Platforms
            </Label>
            <div className={`grid grid-cols-2 gap-4 transition-all ${
              showValidation && selectedPlatforms.length === 0 
                ? 'ring-2 ring-destructive/50 rounded-lg p-2' 
                : ''
            }`}>
              {PLATFORMS.map((platform) => {
                const Icon = platform.icon;
                return (
                  <div
                    key={platform.id}
                    className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <Checkbox
                      id={platform.id}
                      checked={selectedPlatforms.includes(platform.id)}
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
