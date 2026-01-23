import React from "react";
import { Routes, Route } from "react-router-dom";
import { CreatePage } from "@/pages/CreatePage";
import { HistoryPage } from "@/pages/HistoryPage";

const App = () => {
    return (
        <div className="min-h-screen gradient-bg overflow-hidden flex flex-col">
            {/* Decorative floating sparkles - Global Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                {[
                    { left: 8, top: 12 }, { left: 92, top: 8 }, { left: 45, top: 5 },
                    { left: 23, top: 78 }, { left: 67, top: 85 }, { left: 85, top: 45 },
                    { left: 12, top: 55 }, { left: 78, top: 22 }, { left: 35, top: 68 },
                    { left: 55, top: 15 }, { left: 3, top: 35 }, { left: 95, top: 72 },
                    { left: 42, top: 92 }, { left: 18, top: 28 }, { left: 72, top: 58 },
                    { left: 88, top: 88 }, { left: 28, top: 45 }, { left: 62, top: 38 },
                ].map((pos, i) => (
                    <div
                        key={i}
                        className="floating-sparkle"
                        style={{
                            left: `${pos.left}%`,
                            top: `${pos.top}%`,
                            animationDelay: `${i * 0.4}s`,
                            width: `${3 + (i % 3)}px`,
                            height: `${3 + (i % 3)}px`,
                        }}
                    />
                ))}
            </div>

            {/* Application Structure */}
            <div className="flex-1 relative z-10 w-full">
                <Routes>
                    <Route path="/" element={<CreatePage />} />
                    <Route path="/history" element={<HistoryPage />} />
                </Routes>
            </div>

            <footer className="py-8 px-6 border-t border-border/50 relative z-10 mt-auto">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                        <span>Brewed with</span>
                        <span className="text-primary">✨</span>
                        <span>for content alchemists</span>
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default App;
