"use client"

import { Slide } from "@/lib/types"

const COLORS: Record<string, { bg: string; accent: string; badge: string }> = {
  summary:         { bg: "#eef2ff", accent: "#6366f1", badge: "#e0e7ff" },
  skills:          { bg: "#f0fdfa", accent: "#0d9488", badge: "#ccfbf1" },
  experience:      { bg: "#faf5ff", accent: "#7c3aed", badge: "#ede9fe" },
  timeline:        { bg: "#f8fafc", accent: "#4f46e5", badge: "#e0e7ff" },
  strengths:       { bg: "#f0fdf4", accent: "#16a34a", badge: "#dcfce7" },
  recommendations: { bg: "#fffbeb", accent: "#d97706", badge: "#fef3c7" },
  ats_score:       { bg: "#fff1f2", accent: "#e11d48", badge: "#ffe4e6" },
}

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
    <div style={{
      background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
      borderRadius: 16,
      padding: "2rem",
      minHeight: 320,
      display: "flex",
      flexDirection: "column",
      gap: "1.5rem",
      boxShadow: "0 8px 32px rgba(99,102,241,0.25)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{
          background: "rgba(129,140,248,0.2)", color: "#a5b4fc",
          fontSize: 11, fontWeight: 600,
          padding: "4px 10px", borderRadius: 99,
          textTransform: "uppercase", letterSpacing: "0.06em",
          border: "1px solid rgba(129,140,248,0.3)",
        }}>
          Recruiter Snapshot
        </span>
        <span style={{ fontSize: 12, color: "#6366f1" }}>{index + 1} / {total}</span>
      </div>

      <h2 style={{ margin: 0, fontSize: "1.8rem", color: "#f1f5f9", fontWeight: 700, letterSpacing: "-0.02em" }}>
        {slide.body}
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
        {slide.bullets.map((b, i) => {
          const { label, value } = parseLabel(b)
          return (
            <div key={i} style={{
              background: "rgba(255,255,255,0.06)",
              borderRadius: 10,
              padding: "0.75rem 1rem",
              borderLeft: "2px solid rgba(129,140,248,0.5)",
              backdropFilter: "blur(4px)",
            }}>
              <div style={{ fontSize: 10, color: "#818cf8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
                {label}
              </div>
              <div style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 500, lineHeight: 1.4 }}>
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
    <div style={{
      background: "#f8fafc",
      borderRadius: 16,
      padding: "2rem",
      minHeight: 320,
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{
          background: "#e0e7ff", color: "#4f46e5",
          fontSize: 11, fontWeight: 600,
          padding: "4px 10px", borderRadius: 99,
          textTransform: "uppercase", letterSpacing: "0.06em",
        }}>Timeline</span>
        <span style={{ fontSize: 12, color: "#9ca3af" }}>{index + 1} / {total}</span>
      </div>

      <h2 style={{ margin: 0, fontSize: "1.4rem", color: "#111827" }}>{slide.title}</h2>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {slide.bullets.map((b, i) => {
          const arrowIdx = b.indexOf("→")
          const year  = arrowIdx !== -1 ? b.slice(0, arrowIdx).trim() : ""
          const rest  = arrowIdx !== -1 ? b.slice(arrowIdx + 1).trim() : b
          const isLast = i === slide.bullets.length - 1

          return (
            <div key={i} style={{ display: "flex", gap: "1rem" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 16 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#6366f1", flexShrink: 0, marginTop: 4 }} />
                {!isLast && <div style={{ width: 2, flex: 1, background: "#e0e7ff", minHeight: 20 }} />}
              </div>
              <div style={{ paddingBottom: isLast ? 0 : "1rem" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#6366f1", marginBottom: 2 }}>{year}</div>
                <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{rest}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── Default ──────────────────────────────────── */
export default function SlideCard({ slide, index, total }: Props) {
  if (slide.type === "snapshot") return <SnapshotCard slide={slide} index={index} total={total} />
  if (slide.type === "timeline") return <TimelineCard slide={slide} index={index} total={total} />

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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{
          background: c.badge, color: c.accent,
          fontSize: 11, fontWeight: 600,
          padding: "4px 10px", borderRadius: 99,
          textTransform: "uppercase", letterSpacing: "0.06em",
        }}>
          {slide.type.replace("_", " ")}
        </span>
        <span style={{ fontSize: 12, color: "#9ca3af" }}>{index + 1} / {total}</span>
      </div>

      <h2 style={{ margin: 0, fontSize: "1.4rem", color: "#111827" }}>{slide.title}</h2>
      <p style={{ margin: 0, color: "#6b7280", lineHeight: 1.6 }}>{slide.body}</p>

      <ul style={{ margin: 0, paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        {slide.bullets.map((b, i) => (
          <li key={i} style={{ color: "#374151", lineHeight: 1.5 }}>{b}</li>
        ))}
      </ul>
    </div>
  )
}