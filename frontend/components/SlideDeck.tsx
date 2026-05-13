"use client"

import { useEffect, useRef, useState } from "react"
import { SlideDeckResponse } from "@/lib/types"
import SlideCard from "@/components/SlideCard"

interface Props {
  deck: SlideDeckResponse
}

export default function SlideDeck({ deck }: Props) {
  const [current, setCurrent] = useState(0)
  const [exporting, setExporting] = useState(false)
  const slideRef = useRef<HTMLDivElement>(null)
  const total = deck.slides.length

  const prev = () => setCurrent((i) => Math.max(0, i - 1))
  const next = () => setCurrent((i) => Math.min(total - 1, i + 1))

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft")  prev()
      if (e.key === "ArrowRight") next()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  async function handleExport() {
    setExporting(true)
    try {
      const { default: jsPDF } = await import("jspdf")
      const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" })
      const W = doc.internal.pageSize.getWidth()

      deck.slides.forEach((slide, i) => {
        if (i > 0) doc.addPage()

        // background color per type
        const colors: Record<string, [number,number,number]> = {
          summary:         [238, 242, 255],
          skills:          [240, 253, 250],
          experience:      [250, 245, 255],
          strengths:       [240, 253, 244],
          recommendations: [255, 251, 235],
        }
        const [r, g, b] = colors[slide.type] ?? [245, 245, 245]
        doc.setFillColor(r, g, b)
        doc.rect(0, 0, W, doc.internal.pageSize.getHeight(), "F")

        // slide counter
        doc.setFontSize(9)
        doc.setTextColor(156, 163, 175)
        doc.text(`${i + 1} / ${total}`, W - 15, 12, { align: "right" })

        // type badge
        doc.setFontSize(8)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(100, 100, 200)
        doc.text(slide.type.toUpperCase(), 14, 18)

        // title
        doc.setFontSize(22)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(17, 24, 39)
        doc.text(slide.title, 14, 35)

        // body
        doc.setFontSize(11)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(107, 114, 128)
        const bodyLines = doc.splitTextToSize(slide.body, W - 28)
        doc.text(bodyLines, 14, 48)

        // bullets
        doc.setFontSize(11)
        doc.setTextColor(55, 65, 81)
        let y = 48 + bodyLines.length * 7 + 6
        slide.bullets.forEach((b) => {
          const lines = doc.splitTextToSize(`• ${b}`, W - 30)
          doc.text(lines, 18, y)
          y += lines.length * 7 + 2
        })

        // candidate name footer
        doc.setFontSize(9)
        doc.setTextColor(156, 163, 175)
        doc.text(deck.candidate_name, 14, doc.internal.pageSize.getHeight() - 8)
        doc.text("infograph-ai", W - 14, doc.internal.pageSize.getHeight() - 8, { align: "right" })
      })

      doc.save(`${deck.candidate_name.replace(/\s+/g, "_")}_deck.pdf`)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div style={{ marginTop: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2 style={{ margin: 0, color: "#111827" }}>{deck.candidate_name}</h2>
        <button onClick={handleExport} disabled={exporting} style={{
          padding: "0.5rem 1.25rem",
          borderRadius: 8,
          border: "none",
          background: exporting ? "#e5e7eb" : "#6366f1",
          color: exporting ? "#9ca3af" : "#fff",
          fontWeight: 600,
          fontSize: 13,
          cursor: exporting ? "not-allowed" : "pointer",
        }}>
          {exporting ? "Exporting…" : "⬇ Export PDF"}
        </button>
      </div>

      <div ref={slideRef}>
        <SlideCard slide={deck.slides[current]} index={current} total={total} />
      </div>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginTop: "1.25rem" }}>
        <button onClick={prev} disabled={current === 0} style={btnStyle(current === 0)}>← Prev</button>
        <div style={{ display: "flex", gap: 6 }}>
          {deck.slides.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} style={{
              width: 8, height: 8, borderRadius: "50%", border: "none",
              cursor: "pointer", padding: 0,
              background: i === current ? "#6366f1" : "#d1d5db",
              transition: "background 0.2s",
            }} />
          ))}
        </div>
        <button onClick={next} disabled={current === total - 1} style={btnStyle(current === total - 1)}>Next →</button>
      </div>
      <p style={{ textAlign: "center", fontSize: 11, color: "#d1d5db", marginTop: "0.5rem" }}>← → keyboard navigation</p>
    </div>
  )
}

function btnStyle(disabled: boolean) {
  return {
    padding: "0.5rem 1.25rem", borderRadius: 8,
    border: "1px solid #e5e7eb",
    background: disabled ? "#f9fafb" : "#ffffff",
    color: disabled ? "#d1d5db" : "#374151",
    cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: 500, fontSize: 14,
  } as React.CSSProperties
}