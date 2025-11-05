import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface GeneratedContentCardProps {
  platform: string;
  content: string;
  createdAt: string;
}

const PLATFORM_COLORS: Record<string, string> = {
  linkedin: 'bg-blue-600 hover:bg-blue-700',
  twitter: 'bg-sky-500 hover:bg-sky-600',
  reddit: 'bg-orange-600 hover:bg-orange-700',
  instagram: 'bg-pink-600 hover:bg-pink-700',
};

const PLATFORM_LABELS: Record<string, string> = {
  linkedin: 'LinkedIn',
  twitter: 'Twitter',
  reddit: 'Reddit',
  instagram: 'Instagram',
};

export function GeneratedContentCard({ platform, content, createdAt }: GeneratedContentCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
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

  return (
    <Card className="hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Badge className={`${platformColor} text-white transition-transform hover:scale-105`}>
            {platformLabel}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {new Date(createdAt).toLocaleString()}
          </span>
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
          disabled={copied}
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
