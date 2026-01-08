import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Check, AlertCircle, RefreshCw, Cpu } from 'lucide-react';
import { toast } from 'sonner';

interface GeneratedContentCardProps {
  platform: string;
  success: boolean;
  content?: string;  // Optional - only present on success
  modelUsed?: string;
  error?: string;
  errorCode?: string;
  onRetry?: () => void;
}

const PLATFORM_COLORS: Record<string, string> = {
  linkedin: 'bg-blue-600 hover:bg-blue-700',
  twitter: 'bg-sky-500 hover:bg-sky-600',
  reddit: 'bg-orange-600 hover:bg-orange-700',
  instagram: 'bg-pink-600 hover:bg-pink-700',
  facebook: 'bg-blue-700 hover:bg-blue-800',
  tiktok: 'bg-black hover:bg-gray-900',
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
  openai: 'GPT-4o',
  anthropic: 'Claude',
  xai: 'Grok',
};

const MODEL_COLORS: Record<string, string> = {
  gemini: 'bg-purple-600',
  openai: 'bg-green-600',
  anthropic: 'bg-amber-600',
  xai: 'bg-gray-700',
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
  onRetry
}: GeneratedContentCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
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

  const platformColor = PLATFORM_COLORS[platform.toLowerCase()] || 'bg-gray-600 hover:bg-gray-700';
  const platformLabel = PLATFORM_LABELS[platform.toLowerCase()] || platform;
  const modelLabel = modelUsed ? (MODEL_LABELS[modelUsed.toLowerCase()] || modelUsed) : null;
  const modelColor = modelUsed ? (MODEL_COLORS[modelUsed.toLowerCase()] || 'bg-gray-600') : '';
  const errorMessage = errorCode ? (ERROR_MESSAGES[errorCode] || error) : error;

  // Error Card View
  if (!success) {
    return (
      <Card className="border-red-500/50 bg-red-950/20 hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Badge variant="destructive" className="transition-transform hover:scale-105">
              {platformLabel}
            </Badge>
            {modelUsed && (
              <Badge variant="outline" className="text-red-400 border-red-400/50">
                <Cpu className="w-3 h-3 mr-1" />
                {modelLabel}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Error Message */}
          <div className="flex items-start gap-3 p-4 bg-red-900/30 rounded-lg border border-red-500/30">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="font-medium text-red-300">Failed to generate content</p>
              <p className="text-sm text-red-400/80">{errorMessage}</p>
              {errorCode === 'RATE_LIMIT' && (
                <p className="text-xs text-red-400/60 mt-2">
                  💡 The AI model is being used too frequently. Wait a moment and try again.
                </p>
              )}
            </div>
          </div>

          {/* Retry Button */}
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="outline"
              className="w-full border-red-500/50 text-red-300 hover:bg-red-900/30 transition-all"
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
    <Card className="hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Badge className={`${platformColor} text-white transition-transform hover:scale-105`}>
            {platformLabel}
          </Badge>
          {/* Model Badge */}
          {modelUsed && (
            <Badge className={`${modelColor} text-white`}>
              <Cpu className="w-3 h-3 mr-1" />
              {modelLabel}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Content Text */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-sm whitespace-pre-wrap leading-relaxed">
            {content}
          </p>
        </div>

        {/* Copy Button */}
        <Button
          onClick={handleCopy}
          variant="outline"
          className="w-full transition-all"
          disabled={copied || !content}
        >
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4 text-green-600" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Copy to Clipboard
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
