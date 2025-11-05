import { useState } from 'react';
import { Layout } from './components/Layout';
import { ContentComposer } from './components/ContentComposer';
import { ArrowUp } from 'lucide-react';
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

  const handleGenerate = async (ideaPrompt: string, platforms: string[]) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('/content/generate', {
        idea_prompt: ideaPrompt,
        platforms: platforms,
      });

      setGeneratedContent(response.data);
    } catch (err) {
      console.error('Error generating content:', err);
      setError('Failed to generate content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Content Composer */}
        <ContentComposer onGenerate={handleGenerate} isLoading={isLoading} />

        {/* Error Display */}
        {error && (
          <div className="max-w-3xl mx-auto p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Generated Content Display (placeholder for now) */}
        {generatedContent.length > 0 && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">Generated Content</h2>
            <div className="space-y-4">
              {generatedContent.map((content) => (
                <div key={content.id} className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-lg capitalize">{content.platform}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(content.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{content.content_text}</p>
                </div>
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
