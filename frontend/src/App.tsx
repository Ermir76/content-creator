import { useState } from 'react';
import { Layout, type ViewType } from './components/Layout';
import { ContentComposer } from './components/ContentComposer';

import { HistoryView } from './components/HistoryView';
import { ContentViewer } from './components/ContentViewer';
import { Toaster, toast } from 'sonner';
import axios from 'axios';
import { contentApi } from './services/contentApi';
import type { PlatformResult } from './types/content';
import type { PlatformPolicies } from './types/policy';



// Response structure from /content/generate endpoint
interface GenerationResponse {
  results: PlatformResult[];
  success_count: number;
  failure_count: number;
  total_platforms: number;
}

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('create');
  const [generatedContent, setGeneratedContent] = useState<PlatformResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRequest, setLastRequest] = useState<{ ideaPrompt: string; platforms: string[]; platformPolicies: PlatformPolicies } | null>(null);

  const handleGenerate = async (ideaPrompt: string, platforms: string[], platformPolicies: PlatformPolicies = {}) => {
    setIsLoading(true);
    setLastRequest({ ideaPrompt, platforms, platformPolicies });

    try {
      const response = await axios.post<GenerationResponse>('/content/generate', {
        idea_prompt: ideaPrompt,
        platforms: platforms,
        platform_policies: Object.keys(platformPolicies).length > 0 ? platformPolicies : undefined,
      });

      const { results, success_count, failure_count, total_platforms } = response.data;

      // Set generated content with results array
      setGeneratedContent(results);

      // Show appropriate toast notification based on results
      if (failure_count === 0) {
        // All platforms succeeded
        toast.success('Content generated successfully!', {
          description: `Generated ${success_count} piece${success_count > 1 ? 's' : ''} of content`
        });
      } else if (success_count === 0) {
        // All platforms failed
        toast.error('Failed to generate content', {
          description: `All ${total_platforms} platform${total_platforms > 1 ? 's' : ''} failed. Check the results for details.`,
          action: {
            label: 'Retry',
            onClick: handleRetry
          }
        });
      } else {
        // Partial success
        toast.warning('Partial success', {
          description: `${success_count} succeeded, ${failure_count} failed. Check the results for details.`
        });
      }
    } catch (err) {
      console.error('Error generating content:', err);
      // Only catch network/server errors - platform-specific errors are in results array
      if (axios.isAxiosError(err)) {
        if (err.code === 'ERR_NETWORK') {
          toast.error('Cannot connect to server', {
            description: 'Make sure the backend is running at http://localhost:8000',
            action: lastRequest ? {
              label: 'Retry',
              onClick: handleRetry
            } : undefined
          });
        } else if (err.response?.status === 500) {
          toast.error('Server error', {
            description: 'Please check if the backend is running and your API key is configured.',
            action: lastRequest ? {
              label: 'Retry',
              onClick: handleRetry
            } : undefined
          });
        } else {
          toast.error('Failed to generate content', {
            description: err.response?.data?.detail || 'Please try again.',
            action: lastRequest ? {
              label: 'Retry',
              onClick: handleRetry
            } : undefined
          });
        }
      } else {
        toast.error('Unexpected error', {
          description: 'Please try again.',
          action: lastRequest ? {
            label: 'Retry',
            onClick: handleRetry
          } : undefined
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastRequest) {
      handleGenerate(lastRequest.ideaPrompt, lastRequest.platforms, lastRequest.platformPolicies);
    }
  };

  // Handler for retrying a single platform
  const handleRetryPlatform = (platform: string) => {
    if (lastRequest) {
      // Retry just this one platform
      handleGenerate(lastRequest.ideaPrompt, [platform]);
    }
  };

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      <Toaster position="top-right" richColors />

      {/* Create View */}
      {/* 2024-01-20: Added items-stretch to force equal height columns */}
      {currentView === 'create' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch h-full">
          {/* LEFT: Content Creator Input (8 cols) */}
          <div className="lg:col-span-8 space-y-8 flex flex-col">
            <ContentComposer onGenerate={handleGenerate} isLoading={isLoading} />
          </div>

          {/* RIGHT: Output/Preview/Status (4 cols) */}
          <div className="lg:col-span-4 self-start h-full flex flex-col">
            <ContentViewer
              results={generatedContent}
              isLoading={isLoading}
              onRetry={handleRetryPlatform}
              onSave={async (result) => {
                if (result.success && result.content && lastRequest) {
                  await contentApi.saveContent({
                    idea_prompt: lastRequest.ideaPrompt,
                    platform: result.platform,
                    content_text: result.content!,
                    model_used: result.model_used,
                    char_count: result.char_count,
                  });
                }
              }}
            />
          </div>
        </div>
      )}

      {/* History View */}
      {currentView === 'history' && <HistoryView />}
    </Layout>
  );
}

export default App;
