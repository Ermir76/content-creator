import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FlaskConical, ScrollText } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
    const location = useLocation();
    const isHistoryActive = location.pathname === "/history";

    return (
        <header className="sticky top-0 z-50 backdrop-blur-sm border-b border-border/50">
            <div className="card-gradient">
                <div className="max-w-5xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo - Clickable to Home */}
                        <Link
                            to="/"
                            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                        >
                            <FlaskConical className="w-7 h-7 text-primary" />
                            <span className="font-display text-xl font-bold gradient-text">
                                Alchemy Lab
                            </span>
                        </Link>

                        <div className="flex items-center gap-4">
                            {/* History Button */}
                            <Link
                                to="/history"
                                className={`
                                    recipe-tab flex items-center gap-2 px-4 py-2 rounded-lg transition-all
                                    ${isHistoryActive
                                        ? "bg-primary text-primary-foreground shadow-glow"
                                        : "hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                                    }
                                `}
                            >
                                <ScrollText className="w-4 h-4" />
                                <span className="font-medium">History</span>
                            </Link>

                            {/* Theme Toggle */}
                            <div className="bg-muted/50 p-1 rounded-lg">
                                <ThemeToggle />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
