import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Copy, Check, Code, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { contentApi, PlatformPromptPreview } from "@/services/contentApi";

interface PromptPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentIdea: string;
  selectedPlatforms: string[];
  platformPolicies: Record<string, unknown>;
}

export const PromptPreviewModal: React.FC<PromptPreviewModalProps> = ({
  open,
  onOpenChange,
  contentIdea,
  selectedPlatforms,
  platformPolicies,
}) => {
  const [previews, setPreviews] = useState<PlatformPromptPreview[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch prompts from backend when modal opens
  useEffect(() => {
    if (!open) {
      setPreviews([]);
      setError(null);
      return;
    }

    if (!contentIdea.trim() || selectedPlatforms.length === 0) {
      setError("Please enter an idea and select at least one platform.");
      return;
    }

    async function fetchPreviews() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await contentApi.previewPrompt({
          idea_prompt: contentIdea,
          platforms: selectedPlatforms,
          platform_policies: platformPolicies,
        });
        setPreviews(response.previews);
      } catch (err) {
        console.error("Failed to fetch prompt previews:", err);
        setError("Failed to fetch prompt previews. Please try again.");
        toast.error("Failed to preview prompts");
      } finally {
        setIsLoading(false);
      }
    }

    fetchPreviews();
  }, [open, contentIdea, selectedPlatforms, platformPolicies]);

  const handleCopy = async (prompt: string, index: number) => {
    await navigator.clipboard.writeText(prompt);
    setCopiedIndex(index);
    toast.success("Prompt copied! 📋");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] bg-card border-border rounded-3xl p-0 overflow-hidden max-h-[80vh]">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <DialogTitle className="font-display text-xl font-bold flex items-center gap-2">
            <Code className="w-5 h-5 text-primary" />
            Prompt Preview
            <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-1 rounded-full ml-2">
              Actual AI Prompts
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Fetching prompts...</span>
            </div>
          )}

          {error && !isLoading && (
            <div className="text-center py-12 text-muted-foreground">
              {error}
            </div>
          )}

          {!isLoading && !error && previews.length > 0 && (
            <div className="space-y-4">
              {previews.map((preview, index) => (
                <div key={preview.platform} className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      {preview.platform}
                    </span>
                  </div>
                  <div className="relative">
                    <pre className="bg-muted rounded-2xl p-4 text-sm text-foreground overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed max-h-[300px] overflow-y-auto pr-12">
                      {preview.prompt}
                    </pre>
                    <button
                      onClick={() => handleCopy(preview.prompt, index)}
                      className="absolute top-3 right-3 p-2 rounded-xl bg-card border border-border hover:bg-secondary transition-colors"
                    >
                      {copiedIndex === index ? (
                        <Check className="w-4 h-4 text-primary" />
                      ) : (
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && !error && previews.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No previews available
            </div>
          )}

          <p className="text-xs text-muted-foreground mt-4 text-center">
            These are the actual prompts that will be sent to the AI for each platform. 🛠️
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
