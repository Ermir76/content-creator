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
        <Card className="border-2 border-destructive/50 bg-destructive/5 card-hover animate-bounce-in">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <Badge variant="destructive" className="transition-transform hover:scale-105">
                        {platformLabel}
                    </Badge>
                    {modelUsed && (
                        <Badge variant="outline" className="text-destructive border-destructive/50">
                            <Cpu className="w-3 h-3 mr-1" />
                            {modelLabel}
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-destructive/10 rounded-xl border-2 border-destructive/20">
                    <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                        <p className="font-semibold text-destructive">Oops! Something went wrong</p>
                        <p className="text-sm text-destructive/80">{errorMessage}</p>
                        {errorCode === 'RATE_LIMIT' && (
                            <p className="text-xs text-muted-foreground mt-2">
                                The AI is taking a quick breather. Try again in a moment!
                            </p>
                        )}
                    </div>
                </div>
                {onRetry && (
                    <Button
                        onClick={onRetry}
                        variant="destructive"
                        className="w-full"
                    >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Try Again
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
