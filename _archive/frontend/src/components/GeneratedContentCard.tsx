import type { Draft } from '../types/content';
import { ErrorCard } from './generated/ErrorCard';
import { SuccessCard } from './generated/SuccessCard';

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
  if (!success) {
    return (
      <ErrorCard
        platform={platform}
        modelUsed={modelUsed}
        error={error}
        errorCode={errorCode}
        onRetry={onRetry}
      />
    );
  }

  return (
    <SuccessCard
      platform={platform}
      content={content || ''}
      modelUsed={modelUsed}
      drafts={drafts}
      onSave={onSave}
    />
  );
}
