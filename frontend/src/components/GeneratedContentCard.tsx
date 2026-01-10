import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Check, AlertCircle, RefreshCw, Cpu, Eye, Save, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ContentModal } from './ContentModal';
import type { Draft } from '../types/content';

interface GeneratedContentCardProps {
  platform: string;
  success: boolean;
  content?: string;
  modelUsed?: string;
  error?: string;
  errorCode?: string;
  char_count?: number;
  drafts?: Draft[];
  onRetry?: () => void;
  onSave?: () => Promise<void>;
}

const PLATFORM_COLORS: Record<string, string> = {
  linkedin: 'bg-blue-600 shadow-blue-600/20',
  twitter: 'bg-sky-500 shadow-sky-500/20',
  reddit: 'bg-orange-600 shadow-orange-600/20',
  instagram: 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 shadow-pink-500/20',
  facebook: 'bg-blue-700 shadow-blue-700/20',
  tiktok: 'bg-black shadow-black/20',
};

const PLATFORM_LABELS: Record<string, string> = {
  linkedin: 'LinkedIn',
  twitter: 'Twitter',
  reddit: 'Reddit',
  instagram: 'Instagram',
  facebook: 'Facebook',
  tiktok: 'TikTok',
};

const MODEL_LABELS: Record<string, string> = {
  gemini: 'Gemini',
  openai: 'GPT-5',
  anthropic: 'Claude',
  xai: 'Grok',
};

const MODEL_COLORS: Record<string, string> = {
  gemini: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-700',
  openai: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-700',
  anthropic: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-700',
  xai: 'bg-slate-100 text-slate-700 dark:bg-slate-700/30 dark:text-slate-300 border-slate-200 dark:border-slate-600',
};

const ERROR_MESSAGES: Record<string, string> = {
  RATE_LIMIT: 'AI model is rate limited. Try again in a minute.',
  TIMEOUT: 'Request timed out. The AI is taking too long.',
  NETWORK_ERROR: 'Network connection failed.',
  INVALID_API_KEY: 'API key is missing or invalid.',
  VALIDATION_FAILED: 'Generated content did not meet platform requirements.',
  CIRCUIT_OPEN: 'AI model temporarily unavailable.',
  ALL_MODELS_FAILED: 'All AI models failed to generate content.',
};

export function GeneratedContentCard({
  platform,
  success,
  content,
  modelUsed,
  error,
  errorCode,
  drafts,
  onRetry,
  onSave
}: GeneratedContentCardProps) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // State for selected draft (defaults to last one, which is "Final Judge" or just the content)
  // If no drafts, index is -1
  const [selectedDraftIndex, setSelectedDraftIndex] = useState<number>(
    drafts && drafts.length > 0 ? drafts.length - 1 : -1
  );

  // Content to display: either selected draft or the main 'content' prop
  const displayContent = (selectedDraftIndex >= 0 && drafts)
    ? drafts[selectedDraftIndex].content
    : (content || '');

  // Model to display: specific draft model or main modelUsed
  const displayModel = (selectedDraftIndex >= 0 && drafts)
    ? drafts[selectedDraftIndex].model
    : modelUsed;

  const handleCopy = async () => {
    if (!displayContent) return;
    try {
      await navigator.clipboard.writeText(displayContent);
      setCopied(true);
      toast.success('Copied to clipboard!', {
        description: `${platformLabel} content is ready to paste`
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
      toast.error('Failed to copy', {
        description: 'Please try again'
      });
    }
  };

  const handleSave = async () => {
    if (!onSave || saved || saving) return;
    setSaving(true);
    try {
      await onSave();
      setSaved(true);
      toast.success('Content saved!', {
        description: `${platformLabel} content saved to history`
      });
    } catch (err) {
      console.error('Failed to save:', err);
      toast.error('Failed to save', {
        description: 'Please try again'
      });
    } finally {
      setSaving(false);
    }
  };

  const platformColor = PLATFORM_COLORS[platform.toLowerCase()] || 'bg-gray-600';
  const platformLabel = PLATFORM_LABELS[platform.toLowerCase()] || platform;
  const modelLabel = displayModel ? (MODEL_LABELS[displayModel.toLowerCase()] || displayModel) : null;
  const modelColor = displayModel ? (MODEL_COLORS[displayModel.toLowerCase()] || 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300') : '';
  const errorMessage = errorCode ? (ERROR_MESSAGES[errorCode] || error) : error;

  // Truncate content for preview
  const previewText = displayContent && displayContent.length > 200
    ? displayContent.substring(0, 200) + '...'
    : displayContent;

  // Error Card View
  if (!success) {
    return (
      <Card className="border-red-500/50 bg-red-50 dark:bg-red-950/20 card-hover">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Badge variant="destructive" className="transition-transform hover:scale-105">
              {platformLabel}
            </Badge>
            {modelUsed && (
              <Badge variant="outline" className="text-red-600 dark:text-red-400 border-red-300 dark:border-red-400/50">
                <Cpu className="w-3 h-3 mr-1" />
                {modelLabel}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-red-100 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-500/30">
            <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="font-medium text-red-700 dark:text-red-300">Failed to generate content</p>
              <p className="text-sm text-red-600 dark:text-red-400/80">{errorMessage}</p>
              {errorCode === 'RATE_LIMIT' && (
                <p className="text-xs text-red-500 dark:text-red-400/60 mt-2">
                  💡 The AI model is being used too frequently. Wait a moment and try again.
                </p>
              )}
            </div>
          </div>
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="outline"
              className="w-full border-red-300 dark:border-red-500/50 text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry {platformLabel}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  // Success Card View
  return (
    <>
      <Card className={`card-hover bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 overflow-hidden ${saved ? 'ring-2 ring-green-500/50' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className={`${platformColor} text-white shadow-sm transition-transform hover:scale-105`}>
                {platformLabel}
              </Badge>
              {saved && (
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-700">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Saved
                </Badge>
              )}
            </div>
            {displayModel && (
              <Badge variant="outline" className={`${modelColor} text-xs`}>
                <Cpu className="w-3 h-3 mr-1" />
                {modelLabel}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Draft Tabs */}
          {drafts && drafts.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {drafts.map((draft, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedDraftIndex(idx)}
                  className={`px-3 py-1 text-xs rounded-full transition-all border ${selectedDraftIndex === idx
                    ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700 font-medium'
                    : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  title={`${draft.step} used ${draft.model}`}
                >
                  {draft.step === "Final Judge" ? "✨ Final" :
                    draft.step === "Drafter" ? "📝 V1" :
                      draft.step.includes("Challenger") ? "🤔 V2" :
                        draft.step === "Synthesizer" ? "🔬 V3" :
                          draft.step}
                </button>
              ))}
            </div>
          )}

          {/* Content Preview - Clickable to open modal */}
          <div
            onClick={() => setModalOpen(true)}
            className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700/50 cursor-pointer hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
          >
            <p className="text-sm whitespace-pre-wrap leading-relaxed text-slate-700 dark:text-slate-200 line-clamp-4">
              {previewText}
            </p>
          </div>

          {/* Character count */}
          {displayContent && (
            <div className="text-xs text-slate-400 dark:text-slate-500 text-right">
              {displayContent.length} characters
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={() => setModalOpen(true)}
              variant="outline"
              size="sm"
              className="flex-1 border-purple-300 dark:border-purple-600 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
            >
              <Eye className="mr-1 h-4 w-4" />
              View
            </Button>
            <Button
              onClick={handleCopy}
              variant="outline"
              size="sm"
              className={`flex-1 transition-all ${copied ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-600 dark:text-green-400' : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/30'}`}
              disabled={copied}
            >
              {copied ? (
                <>
                  <Check className="mr-1 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-1 h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
            {onSave && (
              <Button
                onClick={handleSave}
                variant="outline"
                size="sm"
                className={`flex-1 transition-all ${saved
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-600 dark:text-green-400'
                  : 'border-green-400 dark:border-green-600 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
                  }`}
                disabled={saved || saving}
              >
                {saved ? (
                  <>
                    <CheckCircle className="mr-1 h-4 w-4" />
                    Saved
                  </>
                ) : saving ? (
                  <>
                    <Save className="mr-1 h-4 w-4 animate-pulse" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-1 h-4 w-4" />
                    Save
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal - View only for generated content (not saved yet) */}
      <ContentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        platform={platform}
        content={displayContent || ''}
        modelUsed={displayModel}
        canEdit={false}
      />
    </>
  );
}
