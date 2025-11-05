import React from 'react';
import { Sparkles } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">
                Social Media Content Generator
              </h1>
              <p className="text-slate-300 mt-1">
                AI-powered platform-specific content creation
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-slate-400">
        <p className="text-sm">
          Powered by Google Gemini AI • Built with React & FastAPI
        </p>
      </footer>
    </div>
  );
}
