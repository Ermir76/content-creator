import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { X, Copy, Check, Save, Edit2, Cpu, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface ContentModalProps {
    isOpen: boolean;
    onClose: () => void;
    platform: string;
    content: string;
    modelUsed?: string;
    createdAt?: string;
    ideaPrompt?: string;
    contentId?: number;
    onSave?: (newContent: string) => Promise<void>;
    onContentUpdate?: (newContent: string) => void;
    canEdit?: boolean;
}

const PLATFORM_COLORS: Record<string, string> = {
    linkedin: 'bg-blue-600 shadow-blue-600/20',
    twitter: 'bg-sky-500 shadow-sky-500/20',
    reddit: 'bg-orange-600 shadow-orange-600/20',
    instagram: 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 shadow-pink-500/20',
    facebook: 'bg-blue-700 shadow-blue-700/20',
    tiktok: 'bg-black shadow-black/20',
};

const PLATFORM_LABELS: Record<string, string> = {
    linkedin: 'LinkedIn',
    twitter: 'Twitter',
    reddit: 'Reddit',
    instagram: 'Instagram',
    facebook: 'Facebook',
    tiktok: 'TikTok',
};

const MODEL_LABELS: Record<string, string> = {
    gemini: 'Gemini',
    openai: 'GPT-5',
    anthropic: 'Claude',
    xai: 'Grok',
};

const MODEL_COLORS: Record<string, string> = {
    gemini: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-700',
    openai: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-700',
    anthropic: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-700',
    xai: 'bg-slate-100 text-slate-700 dark:bg-slate-700/30 dark:text-slate-300 border-slate-200 dark:border-slate-600',
};

const WIDTH_STEPS = [450, 550, 672, 800];
const MAX_HEIGHT_PERCENT = 0.80;

export function ContentModal({
    isOpen,
    onClose,
    platform,
    content,
    modelUsed,
    createdAt,
    ideaPrompt,
    onSave,
    onContentUpdate,
    canEdit = false,
}: ContentModalProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(content);
    const [copied, setCopied] = useState(false);
    const [saving, setSaving] = useState(false);
    const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
    const [lockedDimensions, setLockedDimensions] = useState<{ width: number; height: number } | null>(null);
    const [measurementDone, setMeasurementDone] = useState(false);

    const headerRef = useRef<HTMLDivElement>(null);
    const footerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const platformColor = PLATFORM_COLORS[platform.toLowerCase()] || 'bg-gray-600';
    const platformLabel = PLATFORM_LABELS[platform.toLowerCase()] || platform;
    const modelLabel = modelUsed ? (MODEL_LABELS[modelUsed.toLowerCase()] || modelUsed) : null;
    const modelColor = modelUsed ? (MODEL_COLORS[modelUsed.toLowerCase()] || 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300') : '';

    // Measure and calculate dimensions
    useLayoutEffect(() => {
        if (!isOpen || measurementDone || !modalRef.current || !headerRef.current || !footerRef.current || !contentRef.current) return;

        const maxHeight = window.innerHeight * MAX_HEIGHT_PERCENT;
        const headerHeight = headerRef.current.offsetHeight;
        const footerHeight = footerRef.current.offsetHeight;
        const ideaPromptHeight = modalRef.current.querySelector('.idea-prompt')?.clientHeight || 0;

        // Base static height (header + footer + prompt)
        const chromeHeight = headerHeight + footerHeight + ideaPromptHeight;

        // Try widths to find optimal fit
        for (const width of WIDTH_STEPS) {
            // Set width to test content wrapping
            modalRef.current.style.width = `${width}px`;

            // Get pure content height (natural height of text)
            const contentScrollHeight = contentRef.current.scrollHeight;
            const totalHeight = chromeHeight + contentScrollHeight;

            // Check if this config fits within max height
            // Or if it's the widest option (fallback)
            if (totalHeight <= maxHeight || width === WIDTH_STEPS[WIDTH_STEPS.length - 1]) {
                // Clamp height to max allowed
                const finalHeight = Math.min(totalHeight, maxHeight);

                setDimensions({ width, height: finalHeight });
                setMeasurementDone(true);
                break;
            }
        }
    }, [isOpen, content, measurementDone]);

    // Reset on open
    useEffect(() => {
        if (isOpen) {
            setEditedContent(content);
            setIsEditing(false);
            setDimensions(null);
            setLockedDimensions(null);
            setMeasurementDone(false);
        }
    }, [isOpen, content]);

    // Handle auto-focus
    useEffect(() => {
        if (isEditing && textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(editedContent.length, editedContent.length);
        }
    }, [isEditing]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (isEditing) {
                    setIsEditing(false);
                    setEditedContent(content);
                    setLockedDimensions(null); // Unlock dimensions on escape during edit
                } else {
                    onClose();
                }
            }
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, isEditing, content, onClose]);

    const handleStartEdit = () => {
        if (modalRef.current) {
            // Capture current exact dimensions before rendering textarea
            const rect = modalRef.current.getBoundingClientRect();
            setLockedDimensions({
                width: rect.width,
                height: rect.height
            });
        }
        setIsEditing(true);
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(isEditing ? editedContent : content);
            setCopied(true);
            toast.success('Copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error('Failed to copy');
        }
    };

    const handleSaveEdit = async () => {
        if (!onSave) return;
        setSaving(true);
        try {
            await onSave(editedContent);
            onContentUpdate?.(editedContent);
            setIsEditing(false);
            setLockedDimensions(null); // Unlock after save
            toast.success('Content saved!');
        } catch (err) {
            toast.error('Failed to save changes');
        } finally {
            setSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setEditedContent(content);
        setIsEditing(false);
        setLockedDimensions(null); // Unlock after cancel
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!isOpen) return null;

    // Apply dimensions if calculated, else start with smallest width
    // Use inline style for width/height to ensure they are locked
    const modalStyle: React.CSSProperties = lockedDimensions
        ? {
            width: `${lockedDimensions.width}px`,
            height: `${lockedDimensions.height}px`,
            transition: 'none' // Disable transition when locked to prevent animation
        }
        : dimensions
            ? {
                width: `${dimensions.width}px`,
                height: `${dimensions.height}px`,
                transition: 'width 300ms ease-out, height 300ms ease-out'
            }
            : {
                width: `${WIDTH_STEPS[0]}px`
            };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => {
                    if (!isEditing) onClose();
                }}
            />
            <div
                ref={modalRef}
                style={modalStyle}
                className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col"
            >
                {/* Header */}
                <div ref={headerRef} className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                    <div className="flex items-center gap-3 flex-wrap">
                        <Badge className={`${platformColor} text-white shadow-sm`}>
                            {platformLabel}
                        </Badge>
                        {modelLabel && (
                            <Badge variant="outline" className={`${modelColor} text-xs`}>
                                <Cpu className="w-3 h-3 mr-1" />
                                {modelLabel}
                            </Badge>
                        )}
                        {createdAt && (
                            <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                <Calendar className="w-3 h-3" />
                                {formatDate(createdAt)}
                            </span>
                        )}
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Idea Prompt - if exists */}
                {ideaPrompt && (
                    <div className="idea-prompt px-4 py-2 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                        <p className="text-xs text-slate-500 dark:text-slate-400 italic truncate">
                            Prompt: "{ideaPrompt}"
                        </p>
                    </div>
                )}

                {/* Content Area */}
                <div
                    ref={contentRef}
                    className="p-4 overflow-y-auto flex-1 h-full min-h-0"
                >
                    {isEditing ? (
                        <textarea
                            ref={textareaRef}
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className="w-full h-full p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm leading-relaxed resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent block"
                            placeholder="Edit your content..."
                            style={{ minHeight: '100%', boxSizing: 'border-box' }}
                        />
                    ) : (
                        <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 min-h-full">
                            <p className="text-sm whitespace-pre-wrap leading-relaxed text-slate-700 dark:text-slate-200">
                                {content}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div ref={footerRef} className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                            {(isEditing ? editedContent : content).length} characters
                        </span>
                        <div className="flex gap-2">
                            {isEditing ? (
                                <>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleCancelEdit}
                                        className="border-slate-300 dark:border-slate-600"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={handleSaveEdit}
                                        disabled={saving || editedContent === content}
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                    >
                                        {saving ? (
                                            <>
                                                <Save className="mr-1 h-4 w-4 animate-pulse" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="mr-1 h-4 w-4" />
                                                Save Changes
                                            </>
                                        )}
                                    </Button>
                                </>
                            ) : (
                                <>
                                    {canEdit && onSave && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleStartEdit}
                                            className="border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                        >
                                            <Edit2 className="mr-1 h-4 w-4" />
                                            Edit
                                        </Button>
                                    )}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleCopy}
                                        disabled={copied}
                                        className={copied ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-600 dark:text-green-400' : 'border-slate-300 dark:border-slate-600'}
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="mr-1 h-4 w-4" />
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="mr-1 h-4 w-4" />
                                                Copy
                                            </>
                                        )}
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
