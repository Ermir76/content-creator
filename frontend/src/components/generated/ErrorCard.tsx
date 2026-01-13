import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Cpu } from 'lucide-react';
import { PLATFORM_LABELS, MODEL_LABELS, ERROR_MESSAGES } from './constants';

interface ErrorCardProps {
    platform: string;
    modelUsed?: string;
    error?: string;
    errorCode?: string;
    onRetry?: () => void;
}

export function ErrorCard({
    platform,
    modelUsed,
    error,
    errorCode,
    onRetry
}: ErrorCardProps) {
    const platformLabel = PLATFORM_LABELS[platform.toLowerCase()] || platform;
    const modelLabel = modelUsed ? (MODEL_LABELS[modelUsed.toLowerCase()] || modelUsed) : null;
    const errorMessage = errorCode ? (ERROR_MESSAGES[errorCode] || error) : error;

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
