import React from 'react';
import { Sparkles, PenLine, History } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export type ViewType = 'create' | 'history';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function Layout({ children, currentView, onViewChange }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      {/* Header - Compact single row */}
      <header className="bg-white/80 dark:bg-white/10 backdrop-blur-md border-b border-slate-200 dark:border-white/20 transition-colors duration-300 sticky top-0 z-10">
        <div className="px-4 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <Sparkles className="w-7 h-7 text-blue-500 dark:text-blue-400 flex-shrink-0" />
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white transition-colors duration-300 truncate">
                Content Generator
              </h1>
            </div>

            {/* Tab Navigation + Theme Toggle */}
            <div className="flex items-center gap-2">
              <nav className="flex gap-1">
                <button
                  onClick={() => onViewChange('create')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${currentView === 'create'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/50'
                    }`}
                >
                  <PenLine className="w-4 h-4" />
                  <span className="hidden sm:inline">Create</span>
                </button>
                <button
                  onClick={() => onViewChange('history')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${currentView === 'history'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/50'
                    }`}
                >
                  <History className="w-4 h-4" />
                  <span className="hidden sm:inline">History</span>
                </button>
              </nav>
              <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Edge to edge with minimal padding */}
      <main className="px-4 lg:px-8 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-4 text-center text-slate-500 dark:text-slate-400 transition-colors duration-300">
        <p className="text-xs">
          Powered by Google Gemini AI • Built with React & FastAPI
        </p>
      </footer>
    </div>
  );
}
