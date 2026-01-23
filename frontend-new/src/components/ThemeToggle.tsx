import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="p-2.5 rounded-xl bg-card/60 backdrop-blur-sm border border-border">
        <div className="w-5 h-5" />
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="group p-2.5 rounded-xl bg-card/60 backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-primary transition-transform group-hover:rotate-45 group-hover:scale-110" />
      ) : (
        <Moon className="w-5 h-5 text-primary transition-transform group-hover:-rotate-12 group-hover:scale-110" />
      )}
    </button>
  );
};
