import { useState } from 'react';
import { Layout } from './components/Layout';
import { ContentComposer } from './components/ContentComposer';
import { GeneratedContentCard } from './components/GeneratedContentCard';
import { ArrowUp, Loader2 } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import axios from 'axios';

interface GeneratedContent {
  id: number;
  idea_prompt: string;
  platform: string;
  content_text: string;
  status: string;
  created_at: string;
}

function App() {
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRequest, setLastRequest] = useState<{ ideaPrompt: string; platforms: string[] } | null>(null);

  const handleGenerate = async (ideaPrompt: string, platforms: string[]) => {
    setIsLoading(true);
    setLastRequest({ ideaPrompt, platforms });

    try {
      const response = await axios.post('/content/generate', {
        idea_prompt: ideaPrompt,
        platforms: platforms,
      });

      setGeneratedContent(response.data);
      toast.success('Content generated successfully!', {
        description: `Generated ${response.data.length} piece${response.data.length > 1 ? 's' : ''} of content`
      });
    } catch (err) {
      console.error('Error generating content:', err);
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 500) {
          toast.error('Server error', {
            description: 'Please check if the backend is running and your API key is configured.',
            action: lastRequest ? {
              label: 'Retry',
              onClick: handleRetry
            } : undefined
          });
        } else if (err.code === 'ERR_NETWORK') {
          toast.error('Cannot connect to server', {
            description: 'Make sure the backend is running at http://localhost:8000',
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

  return (
    <Layout>
      <Toaster position="top-right" richColors />
      <div className="space-y-8">
        {/* Content Composer */}
        <ContentComposer onGenerate={handleGenerate} isLoading={isLoading} />

        {/* Loading State */}
        {isLoading && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center py-12 px-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-slate-700">
              <div className="flex flex-col items-center gap-6">
                <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-white">
                    Generating Your Content...
                  </h3>
                  <p className="text-slate-400">
                    AI is crafting platform-specific posts for you
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Generated Content Display */}
        {generatedContent.length > 0 && !isLoading && (
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-white">Generated Content</h2>
            <div className="grid gap-6">
              {generatedContent.map((content) => (
                <GeneratedContentCard
                  key={content.id}
                  platform={content.platform}
                  content={content.content_text}
                  createdAt={content.created_at}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {generatedContent.length === 0 && !isLoading && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center py-16 px-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-slate-700">
              <div className="flex flex-col items-center gap-6">
                <div className="relative">
                  <ArrowUp className="w-16 h-16 text-slate-400 animate-bounce" />
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-white">
                    Ready to Create Amazing Content?
                  </h3>
                  <p className="text-slate-300 text-lg max-w-md mx-auto">
                    Enter your content idea above, select your target platforms, and let AI craft engaging posts for you
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 justify-center mt-4">
                  <div className="px-4 py-2 bg-slate-700/50 rounded-full text-sm text-slate-300">
                    ✨ AI-Powered
                  </div>
                  <div className="px-4 py-2 bg-slate-700/50 rounded-full text-sm text-slate-300">
                    🎯 Platform-Specific
                  </div>
                  <div className="px-4 py-2 bg-slate-700/50 rounded-full text-sm text-slate-300">
                    ⚡ Instant Results
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default App;
