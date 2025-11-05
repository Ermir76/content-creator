import { useState } from 'react';
import { Layout } from './components/Layout';
import { ContentComposer } from './components/ContentComposer';
import { GeneratedContentCard } from './components/GeneratedContentCard';
import { Card, CardContent } from './components/ui/card';
import { Button } from './components/ui/button';
import { ArrowUp, AlertCircle, RefreshCw } from 'lucide-react';
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
  const [error, setError] = useState<string | null>(null);
  const [lastRequest, setLastRequest] = useState<{ ideaPrompt: string; platforms: string[] } | null>(null);

  const handleGenerate = async (ideaPrompt: string, platforms: string[]) => {
    setIsLoading(true);
    setError(null);
    setLastRequest({ ideaPrompt, platforms });

    try {
      const response = await axios.post('/content/generate', {
        idea_prompt: ideaPrompt,
        platforms: platforms,
      });

      setGeneratedContent(response.data);
    } catch (err) {
      console.error('Error generating content:', err);
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 500) {
          setError('Server error. Please check if the backend is running and your API key is configured.');
        } else if (err.code === 'ERR_NETWORK') {
          setError('Cannot connect to the server. Make sure the backend is running at http://localhost:8000');
        } else {
          setError(err.response?.data?.detail || 'Failed to generate content. Please try again.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
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
      <div className="space-y-8">
        {/* Content Composer */}
        <ContentComposer onGenerate={handleGenerate} isLoading={isLoading} />

        {/* Error Display */}
        {error && (
          <div className="max-w-3xl mx-auto">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-red-900">Error</p>
                    <p className="text-red-700 text-sm mt-1">{error}</p>
                    {lastRequest && (
                      <Button
                        onClick={handleRetry}
                        variant="outline"
                        size="sm"
                        className="mt-3 border-red-300 text-red-700 hover:bg-red-100"
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Retry
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Generated Content Display */}
        {generatedContent.length > 0 && (
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
          <div className="max-w-3xl mx-auto text-center py-12">
            <div className="flex flex-col items-center gap-4">
              <ArrowUp className="w-12 h-12 text-slate-400 animate-bounce" />
              <p className="text-slate-300 text-lg">
                Enter your idea above and select platforms to get started!
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default App;
