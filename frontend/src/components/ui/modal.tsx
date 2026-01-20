import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
    isOpen: boolean
    onClose: () => void
    title?: string
    description?: string
    children: React.ReactNode
}

export function Modal({
    isOpen,
    onClose,
    title,
    description,
    children,
    className,
    ...props
}: ModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className={cn(
                    "relative w-full max-w-2xl mx-4 bg-card rounded-2xl shadow-2xl border border-border flex flex-col max-h-[90vh] text-card-foreground animate-in zoom-in-95 duration-200 slide-in-from-bottom-2",
                    className
                )}
                {...props}
            >
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <div className="space-y-1">
                        {title && <h2 className="text-xl font-bold tracking-tight">{title}</h2>}
                        {description && <p className="text-sm text-muted-foreground">{description}</p>}
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 hover:bg-muted transition-colors"
                    >
                        <X className="w-5 h-5 text-muted-foreground" />
                        <span className="sr-only">Close</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {children}
                </div>
            </div>
        </div>
    )
}
