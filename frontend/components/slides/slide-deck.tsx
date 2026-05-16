"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Download, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react"
import { Slide } from "@/lib/types"
import { SlideCard } from "./slide-card"
import { Button } from "@/components/ui/button"
import { useUIStore } from "@/lib/stores/ui-store"
import { exportToPDF } from "@/lib/export-pdf"

interface Props {
  slides: Slide[]
  candidateName?: string
}

export function SlideDeck({ slides, candidateName }: Props) {
  const { activeSlide, setActiveSlide, isFullscreen, toggleFullscreen } = useUIStore()
  const [exporting, setExporting] = React.useState(false)
  const total = slides.length

  const prev = React.useCallback(() => setActiveSlide(Math.max(0, activeSlide - 1)), [activeSlide, setActiveSlide])
  const next = React.useCallback(() => setActiveSlide(Math.min(total - 1, activeSlide + 1)), [activeSlide, setActiveSlide, total])

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prev()
      if (e.key === "ArrowRight") next()
      if (e.key === "f" || e.key === "F") toggleFullscreen()
      if (e.key === "Escape" && isFullscreen) toggleFullscreen()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [prev, next, toggleFullscreen, isFullscreen])

  async function handleExport() {
    setExporting(true)
    try {
      await exportToPDF({ slides, candidate_name: candidateName || "Candidate" })
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className={`flex flex-col w-full max-w-5xl mx-auto transition-all ${isFullscreen ? "fixed inset-0 z-50 bg-background p-8 max-w-none" : ""}`}>
      
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-lg border border-border/70 bg-card px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Generated Presentation
          </p>
          <h2 className="mt-1 text-lg font-semibold text-foreground">
            {candidateName || "Candidate"}&apos;s Deck
          </h2>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleFullscreen}
            className="h-9 gap-2 border-border/80"
            title="Toggle fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            {isFullscreen ? "Exit" : "Fullscreen"}
          </Button>
          <Button 
            onClick={handleExport} 
            disabled={exporting}
            size="sm"
            className="h-9 gap-2"
          >
            <Download className="w-4 h-4" />
            {exporting ? "Exporting..." : "Export PDF"}
          </Button>
        </div>
      </div>

      {/* Slide Container */}
      <div className="relative mt-5 flex max-h-[560px] min-h-[460px] flex-col overflow-hidden rounded-lg border border-border/70 bg-card shadow-sm md:h-[52vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full p-4 md:p-8 overflow-y-auto"
          >
            <SlideCard slide={slides[activeSlide]} index={activeSlide} total={total} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-6 mt-5">
        <Button
          variant="outline"
          size="icon"
          onClick={prev}
          disabled={activeSlide === 0}
          className="rounded-full"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="sr-only">Previous slide</span>
        </Button>
        
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSlide(i)}
              className={`w-2.5 h-2.5 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                i === activeSlide ? "bg-primary" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === activeSlide ? "true" : "false"}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={next}
          disabled={activeSlide === total - 1}
          className="rounded-full"
        >
          <ChevronRight className="w-5 h-5" />
          <span className="sr-only">Next slide</span>
        </Button>
      </div>
      
      <p className="text-center text-xs text-muted-foreground mt-3">
        Use <kbd className="px-1.5 py-0.5 bg-muted rounded border">←</kbd> <kbd className="px-1.5 py-0.5 bg-muted rounded border">→</kbd> to navigate, <kbd className="px-1.5 py-0.5 bg-muted rounded border">F</kbd> for fullscreen
      </p>
    </div>
  )
}
