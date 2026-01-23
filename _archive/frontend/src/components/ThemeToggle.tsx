import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="relative p-2.5 rounded-full bg-muted hover:bg-accent border-2 border-border transition-all duration-200 group btn-bounce"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
            <div className="relative w-5 h-5">
                {theme === 'dark' ? (
                    <Sun className="w-5 h-5 text-highlight group-hover:rotate-45 group-hover:scale-110 transition-transform duration-300" />
                ) : (
                    <Moon className="w-5 h-5 text-primary group-hover:-rotate-12 group-hover:scale-110 transition-transform duration-300" />
                )}
            </div>
        </button>
    );
}
