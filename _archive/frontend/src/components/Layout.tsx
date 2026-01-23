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
    <div className="min-h-screen bg-background relative overflow-hidden transition-colors duration-300">
      {/* Decorative background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-secondary/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 w-72 h-72 bg-highlight/20 rounded-full blur-3xl" />
      </div>

      {/* Header - Playful compact design */}
      <header className="bg-card/80 backdrop-blur-md border-b-2 border-border transition-colors duration-300 sticky top-0 z-10">
        <div className="px-4 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Sparkles className="w-8 h-8 text-highlight animate-pulse flex-shrink-0" />
              </div>
              <h1 className="text-xl md:text-2xl font-bold gradient-text transition-colors duration-300 truncate">
                Content Generator
              </h1>
            </div>

            {/* Pill Navigation + Theme Toggle */}
            <div className="flex items-center gap-3">
              <nav className="flex gap-1 bg-muted/50 p-1 rounded-full">
                <button
                  onClick={() => onViewChange('create')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 btn-bounce ${currentView === 'create'
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                >
                  <PenLine className="w-4 h-4" />
                  <span className="hidden sm:inline">Create</span>
                </button>
                <button
                  onClick={() => onViewChange('history')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 btn-bounce ${currentView === 'history'
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                >
                  <History className="w-4 h-4" />
                  <span className="hidden sm:inline">History</span>
                </button>
              </nav>
              <div className="w-px h-6 bg-border mx-1"></div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative px-4 lg:px-8 py-6">
        {children}
      </main>

      {/* Footer - Friendlier */}
      <footer className="relative mt-auto py-6 text-center text-muted-foreground transition-colors duration-300">
        <p className="text-sm font-medium">
          Made with <span className="text-accent">♥</span> • Powered by AI
        </p>
      </footer>
    </div>
  );
}
