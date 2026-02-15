"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "error" | "warning"
  onClose?: () => void
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant = "default", onClose, children, ...props }, ref) => {
    const variants = {
      default: "bg-white border-slate-200 text-slate-900",
      success: "bg-emerald-50 border-emerald-200 text-emerald-900",
      error: "bg-rose-50 border-rose-200 text-rose-900",
      warning: "bg-amber-50 border-amber-200 text-amber-900",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "pointer-events-auto flex w-full max-w-md items-center justify-between gap-4 rounded-lg border p-4 shadow-lg transition-all",
          variants[variant],
          className
        )}
        {...props}
      >
        <div className="flex-1">{children}</div>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-md p-1 hover:bg-slate-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    )
  }
)
Toast.displayName = "Toast"

export { Toast }
