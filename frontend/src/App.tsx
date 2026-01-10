import { useState } from 'react';
import { Layout, type ViewType } from './components/Layout';
import { ContentComposer } from './components/ContentComposer';
import { GeneratedContentCard } from './components/GeneratedContentCard';
import { HistoryView } from './components/HistoryView';
import { ArrowUp, Loader2 } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import axios from 'axios';
import { contentApi } from './services/contentApi';
import type { PlatformResult } from './types/content';



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
  const [lastRequest, setLastRequest] = useState<{ ideaPrompt: string; platforms: string[] } | null>(null);

  const handleGenerate = async (ideaPrompt: string, platforms: string[]) => {
    setIsLoading(true);
    setLastRequest({ ideaPrompt, platforms });

    try {
      const response = await axios.post<GenerationResponse>('/content/generate', {
        idea_prompt: ideaPrompt,
        platforms: platforms,
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
      handleGenerate(lastRequest.ideaPrompt, lastRequest.platforms);
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
      {currentView === 'create' && (
        <div className="space-y-8">
          {/* Content Composer */}
          <ContentComposer onGenerate={handleGenerate} isLoading={isLoading} />

          {/* Loading State */}
          {isLoading && (
            <div className="max-w-3xl mx-auto">
              <div className="text-center py-12 px-6 bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 rounded-2xl border border-slate-300 dark:border-slate-700">
                <div className="flex flex-col items-center gap-6">
                  <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                      Generating Your Content...
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      AI is crafting platform-specific posts for you
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Generated Content Display */}
          {generatedContent.length > 0 && !isLoading && (
            <div className="max-w-7xl mx-auto space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Generated Content</h2>
              <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
                {generatedContent.map((result, index) => (
                  <div
                    key={`${result.platform}-${index}`}
                    className="animate-in fade-in slide-in-from-bottom-4"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <GeneratedContentCard
                      platform={result.platform}
                      success={result.success}
                      content={result.content}
                      modelUsed={result.model_used}
                      error={result.error}
                      errorCode={result.error_code}
                      drafts={result.drafts}
                      onRetry={() => handleRetryPlatform(result.platform)}
                      onSave={result.success && result.content && lastRequest ? async () => {
                        await contentApi.saveContent({
                          idea_prompt: lastRequest.ideaPrompt,
                          platform: result.platform,
                          content_text: result.content!,
                          model_used: result.model_used,
                          char_count: result.char_count,
                        });
                      } : undefined}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {generatedContent.length === 0 && !isLoading && (
            <div className="max-w-5xl mx-auto">
              <div className="text-center py-16 px-6 bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 rounded-2xl border border-slate-300 dark:border-slate-700">
                <div className="flex flex-col items-center gap-6">
                  <div className="relative">
                    <ArrowUp className="w-16 h-16 text-slate-400 animate-bounce" />
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      Ready to Create Amazing Content?
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 text-lg max-w-md mx-auto">
                      Enter your content idea above, select your target platforms, and let AI craft engaging posts for you
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 justify-center mt-4">
                    <div className="px-4 py-2 bg-slate-300/50 dark:bg-slate-700/50 rounded-full text-sm text-slate-600 dark:text-slate-300">
                      ✨ Multi-AI Powered
                    </div>
                    <div className="px-4 py-2 bg-slate-300/50 dark:bg-slate-700/50 rounded-full text-sm text-slate-600 dark:text-slate-300">
                      🎯 Platform-Specific
                    </div>
                    <div className="px-4 py-2 bg-slate-300/50 dark:bg-slate-700/50 rounded-full text-sm text-slate-600 dark:text-slate-300">
                      ⚡ Smart Fallback
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* History View */}
      {currentView === 'history' && <HistoryView />}
    </Layout>
  );
}

export default App;
