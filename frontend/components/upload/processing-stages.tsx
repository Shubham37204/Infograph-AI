"use client"

import * as React from "react"
import { Check, Loader2, Circle } from "lucide-react"
import { cn } from "@/lib/cn"

const STAGES = [
  { id: "parsing", label: "Extracting document data" },
  { id: "analyzing", label: "AI Resume analysis" },
  { id: "slides", label: "Formatting presentation" },
]

interface Props {
  currentStage: string
}

export function ProcessingStages({ currentStage }: Props) {
  const currentIndex = STAGES.findIndex(s => s.id === currentStage)

  return (
    <div className="w-full max-w-sm mx-auto p-6 space-y-4" aria-live="polite">
      <div className="flex flex-col gap-4">
        {STAGES.map((stage, index) => {
          const isCompleted = index < currentIndex
          const isCurrent = index === currentIndex
          
          return (
            <div key={stage.id} className="flex items-center gap-3">
              <div className="flex items-center justify-center w-5 h-5 shrink-0">
                {isCompleted ? (
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500">
                    <Check className="w-3 h-3" />
                  </div>
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                ) : (
                  <Circle className="w-4 h-4 text-muted-foreground/30" />
                )}
              </div>
              <span className={cn(
                "text-xs font-medium transition-colors duration-200",
                isCurrent ? "text-foreground" : isCompleted ? "text-muted-foreground" : "text-muted-foreground/50"
              )}>
                {stage.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
