"use client"

import * as React from "react"
import { UploadCloud, FileType, X } from "lucide-react"
import { cn } from "@/lib/cn"

interface DropZoneProps {
  onFileSelect: (file: File) => void
  disabled?: boolean
}

export function DropZone({ onFileSelect, disabled }: DropZoneProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const validateAndSelect = (file: File) => {
    setError(null)
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file.")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File exceeds the 5MB limit.")
      return
    }
    onFileSelect(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (disabled) return
    const file = e.dataTransfer.files[0]
    if (file) validateAndSelect(file)
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        className={cn(
          "relative group flex flex-col items-center justify-center w-full h-48 p-6 border border-dashed rounded-lg transition-colors duration-200",
          disabled ? "opacity-50 cursor-not-allowed bg-muted/10 border-white/5" : "cursor-pointer",
          isDragging
            ? "border-primary/50 bg-white/[0.02]"
            : "border-white/10 hover:border-white/20 hover:bg-white/[0.01]"
        )}
        onDragOver={(e) => {
          e.preventDefault()
          if (!disabled) setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Upload resume PDF"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            !disabled && fileInputRef.current?.click()
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) validateAndSelect(file)
            // Reset input so same file can be selected again
            if (e.target) e.target.value = ""
          }}
          disabled={disabled}
        />
        
        <div className="flex flex-col items-center gap-3 text-center z-10 relative">
          <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-muted-foreground transition-all duration-200">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-foreground">
              Drop your resume or <span className="text-foreground underline underline-offset-4 cursor-pointer">click to browse</span>
            </p>
            <p className="mt-1 text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
              PDF only • Max 5MB
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
          <FileType className="w-4 h-4 shrink-0" />
          <p>{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-auto hover:opacity-70"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
