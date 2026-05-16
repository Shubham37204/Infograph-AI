"use client"

import { Slide } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/cn"

interface Props {
  slide: Slide
  index: number
  total: number
}

function parseLabel(bullet: string) {
  const idx = bullet.indexOf(":")
  if (idx === -1) return { label: "", value: bullet }
  return { label: bullet.slice(0, idx).trim(), value: bullet.slice(idx + 1).trim() }
}

/* ── Snapshot ─────────────────────────────────── */
function SnapshotCard({ slide, index, total }: Props) {
  return (
    <div className="flex flex-col gap-6 min-h-[400px] p-8 md:p-12 bg-card border border-white/5 rounded-lg shadow-sm">
      <div className="flex justify-between items-start">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
          Overview • {index + 1} of {total}
        </span>
      </div>

      <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight m-0 leading-[1.1]">
        {slide.body}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5 rounded-lg overflow-hidden mt-auto">
        {slide.bullets.map((b, i) => {
          const { label, value } = parseLabel(b)
          return (
            <div key={i} className="p-5 bg-card">
              <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 opacity-60">
                {label}
              </div>
              <div className="text-sm font-medium text-foreground leading-relaxed">
                {value}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── Timeline ─────────────────────────────────── */
function TimelineCard({ slide, index, total }: Props) {
  return (
    <div className="flex flex-col gap-8 min-h-[400px] p-8 md:p-12 bg-card border border-white/5 rounded-lg shadow-sm">
      <div className="flex justify-between items-start">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
          Timeline • {index + 1} of {total}
        </span>
      </div>

      <h2 className="text-2xl md:text-3xl font-bold text-foreground m-0 tracking-tight">{slide.title}</h2>

      <div className="flex flex-col mt-4 relative">
        <div className="absolute left-[5px] top-2 bottom-2 w-px bg-white/5" />
        {slide.bullets.map((b, i) => {
          const arrowIdx = b.indexOf("→")
          const year = arrowIdx !== -1 ? b.slice(0, arrowIdx).trim() : ""
          const rest = arrowIdx !== -1 ? b.slice(arrowIdx + 1).trim() : b

          return (
            <div key={i} className="flex gap-6 relative pb-8 last:pb-0">
              <div className="w-2.5 h-2.5 rounded-full bg-foreground/10 border border-background shrink-0 mt-1.5 z-10" />
              <div className="flex flex-col gap-1">
                <div className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">{year}</div>
                <div className="text-sm text-foreground leading-relaxed max-w-xl">{rest}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── Default ──────────────────────────────────── */
export function SlideCard({ slide, index, total }: Props) {
  if (slide.type === "snapshot") return <SnapshotCard slide={slide} index={index} total={total} />
  if (slide.type === "timeline") return <TimelineCard slide={slide} index={index} total={total} />

  return (
    <div className="w-full h-full p-8 md:p-12 flex flex-col bg-card border border-white/5 rounded-lg shadow-sm relative">
      <div className="flex justify-between items-start mb-10">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
          {slide.type.replace("_", " ")} • {index + 1} of {total}
        </span>
      </div>

      <h2 className="text-2xl font-bold text-foreground m-0 mb-6 tracking-tight">{slide.title}</h2>
      
      {slide.body && (
        <p className="text-base text-muted-foreground leading-relaxed m-0 mb-8 max-w-2xl">{slide.body}</p>
      )}

      <div className="flex flex-col gap-2">
        {slide.bullets.map((b, i) => {
          const { label, value } = parseLabel(b)
          return (
            <div key={i} className="flex flex-col py-2 border-b border-white/5 last:border-0">
              {label && (
                <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1 opacity-60">
                  {label}
                </div>
              )}
              <div className="text-sm text-foreground leading-relaxed">
                {value}
              </div>
            </div>
          )
        })}
      </div>
      
      {slide.chart_image && (
        <div className="mt-8 flex justify-center">
          <img 
            src={`data:image/png;base64,${slide.chart_image}`} 
            alt="Data Visualization" 
            className="max-h-48 rounded grayscale invert opacity-80 contrast-125"
          />
        </div>
      )}
    </div>
  )
}
