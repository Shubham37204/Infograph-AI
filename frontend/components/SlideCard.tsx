"use client"

import { Slide } from "@/lib/types"

const COLORS: Record<string, { bg: string; accent: string; badge: string }> = {
  summary:         { bg: "#eef2ff", accent: "#6366f1", badge: "#e0e7ff" },
  skills:          { bg: "#f0fdfa", accent: "#0d9488", badge: "#ccfbf1" },
  experience:      { bg: "#faf5ff", accent: "#7c3aed", badge: "#ede9fe" },
  strengths:       { bg: "#f0fdf4", accent: "#16a34a", badge: "#dcfce7" },
  recommendations: { bg: "#fffbeb", accent: "#d97706", badge: "#fef3c7" },
}

interface Props {
  slide: Slide
  index: number
  total: number
}

export default function SlideCard({ slide, index, total }: Props) {
  const c = COLORS[slide.type] ?? COLORS.summary

  return (
    <div style={{
      background: c.bg,
      borderRadius: 16,
      padding: "2rem",
      minHeight: 320,
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
    }}>
      {/* header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{
          background: c.badge,
          color: c.accent,
          fontSize: 11,
          fontWeight: 600,
          padding: "4px 10px",
          borderRadius: 99,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}>
          {slide.type}
        </span>
        <span style={{ fontSize: 12, color: "#9ca3af" }}>{index + 1} / {total}</span>
      </div>

      {/* title */}
      <h2 style={{ margin: 0, fontSize: "1.4rem", color: "#111827" }}>{slide.title}</h2>

      {/* body */}
      <p style={{ margin: 0, color: "#6b7280", lineHeight: 1.6 }}>{slide.body}</p>

      {/* bullets */}
      <ul style={{ margin: 0, paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        {slide.bullets.map((b, i) => (
          <li key={i} style={{ color: "#374151", lineHeight: 1.5 }}>{b}</li>
        ))}
      </ul>
    </div>
  )
}