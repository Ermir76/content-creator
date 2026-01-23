import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Copy, Check, Code } from "lucide-react";
import { toast } from "sonner";
import { VibeConfig } from "@/components/VibePreset";

interface PromptPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentIdea: string;
  selectedPlatforms: string[];
  vibeConfig: VibeConfig;
  perspective: string;
  corporateVoice: boolean;
}

export const PromptPreviewModal: React.FC<PromptPreviewModalProps> = ({
  open,
  onOpenChange,
  contentIdea,
  selectedPlatforms,
  vibeConfig,
  perspective,
  corporateVoice,
}) => {
  const [copied, setCopied] = React.useState(false);

  const generatePrompt = () => {
    const perspectiveText = {
      "first-person": "first person (I, me, my)",
      "second-person": "second person (you, your)",
      "third-person": "third person (they, them)",
      we: "collective voice (we, our)",
    }[perspective];

    const traits = [];
    if (vibeConfig.humanity > 60) traits.push("human and relatable");
    if (vibeConfig.friendliness > 60) traits.push("warm and friendly");
    if (vibeConfig.provocative > 60) traits.push("bold and provocative");
    if (vibeConfig.professionalism > 60) traits.push("professional");
    if (vibeConfig.vulnerability > 60) traits.push("open and vulnerable");
    if (vibeConfig.opinionated > 60) traits.push("opinionated with strong takes");
    if (vibeConfig.honesty > 60) traits.push("honest and direct");
    if (vibeConfig.raw > 60) traits.push("raw and unfiltered");

    return `You are a social media content creator writing for ${selectedPlatforms.join(", ")}.

CONTENT IDEA:
${contentIdea}

VOICE & STYLE:
- Perspective: ${perspectiveText}
- Tone traits: ${traits.length > 0 ? traits.join(", ") : "balanced and neutral"}
- Corporate voice: ${corporateVoice ? "Yes - keep it brand-safe and professional" : "No - be authentic and personal"}

PERSONALITY SCORES (0-100):
- Humanity: ${vibeConfig.humanity}%
- Friendliness: ${vibeConfig.friendliness}%
- Provocative: ${vibeConfig.provocative}%
- Professionalism: ${vibeConfig.professionalism}%
- Vulnerability: ${vibeConfig.vulnerability}%
- Opinionated: ${vibeConfig.opinionated}%

AUTHENTICITY SCORES:
- Honesty: ${vibeConfig.honesty}%
- Polished: ${vibeConfig.polished}%
- Raw: ${vibeConfig.raw}%

Generate engaging, platform-optimized content for each selected platform. Adapt the format, length, and style to match each platform's best practices while maintaining the specified voice.`;
  };

  const prompt = generatePrompt();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    toast.success("Prompt copied! 📋");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-card border-border rounded-3xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <DialogTitle className="font-display text-xl font-bold flex items-center gap-2">
            <Code className="w-5 h-5 text-primary" />
            Prompt Preview
            <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-1 rounded-full ml-2">
              Power User Mode
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">
          <div className="relative">
            <pre className="bg-muted rounded-2xl p-4 text-sm text-foreground overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed max-h-[400px] overflow-y-auto">
              {prompt}
            </pre>
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 p-2 rounded-xl bg-card border border-border hover:bg-secondary transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4 text-primary" />
              ) : (
                <Copy className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          </div>

          <p className="text-xs text-muted-foreground mt-4 text-center">
            This is the prompt that will be sent to the AI. Feel free to copy and tweak it! 🛠️
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
