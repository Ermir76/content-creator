import React from 'react';
import { Sparkles } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white/80 dark:bg-white/10 backdrop-blur-md border-b border-slate-200 dark:border-white/20 transition-colors duration-300">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-blue-500 dark:text-blue-400" />
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white transition-colors duration-300">
                  Social Media Content Generator
                </h1>
                <p className="text-slate-600 dark:text-slate-300 mt-1 transition-colors duration-300">
                  AI-powered platform-specific content creation
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-slate-500 dark:text-slate-400 transition-colors duration-300">
        <p className="text-sm">
          Powered by Google Gemini AI • Built with React &amp; FastAPI
        </p>
      </footer>
    </div>
  );
}
