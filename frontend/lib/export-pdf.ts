import { SlideDeckResponse } from "@/lib/types"

function cleanBulletLabel(bullet: string): string {
  const idx = bullet.indexOf(":")
  if (idx === -1) return bullet

  const label = bullet.slice(0, idx).replace(/^[^\p{L}\p{N}]+/u, "").trim()
  return `${label}: ${bullet.slice(idx + 1).trim()}`
}

/**
 * Cleanly separated PDF generation module.
 * Takes a SlideDeckResponse and generates a multi-page PDF.
 */
export async function exportToPDF(deck: SlideDeckResponse): Promise<void> {
  const { default: jsPDF } = await import("jspdf")
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" })
  const W = doc.internal.pageSize.getWidth()
  const H = doc.internal.pageSize.getHeight()

  const colors: Record<string, [number, number, number]> = {
    summary: [238, 242, 255], // indigo-50
    skills: [240, 253, 250], // teal-50
    experience: [250, 245, 255], // purple-50
    timeline: [248, 250, 252], // slate-50
    strengths: [240, 253, 244], // green-50
    recommendations: [255, 251, 235], // amber-50
    ats_score: [255, 241, 242], // rose-50
    snapshot: [30, 27, 75], // dark indigo
  }

  deck.slides.forEach((slide, i) => {
    if (i > 0) doc.addPage()

    const isDark = slide.type === "snapshot"
    const [r, g, b] = colors[slide.type] || [248, 250, 252]
    
    // Background
    doc.setFillColor(r, g, b)
    doc.rect(0, 0, W, H, "F")

    // Slide Counter
    doc.setFontSize(9)
    doc.setTextColor(isDark ? 165 : 156, isDark ? 180 : 163, isDark ? 252 : 175)
    doc.text(`${i + 1} / ${deck.slides.length}`, W - 15, 12, { align: "right" })

    // Type Badge
    doc.setFontSize(8)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(isDark ? 129 : 99, isDark ? 140 : 102, isDark ? 248 : 241) // primary color
    doc.text(slide.type.replace("_", " ").toUpperCase(), 14, 18)

    // Title
    doc.setFontSize(22)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(isDark ? 241 : 15, isDark ? 245 : 23, isDark ? 249 : 42)
    doc.text(slide.title, 14, 35)

    // Body
    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(isDark ? 203 : 100, isDark ? 213 : 116, isDark ? 225 : 139)
    const bodyLines = doc.splitTextToSize(slide.body, W - 28)
    doc.text(bodyLines, 14, 48)

    // Bullets
    doc.setFontSize(11)
    doc.setTextColor(isDark ? 226 : 55, isDark ? 232 : 65, isDark ? 240 : 81)
    let y = 48 + bodyLines.length * 7 + 8
    
    slide.bullets.forEach((b) => {
      // Very basic handling for timeline arrows/bolding could go here
      const lines = doc.splitTextToSize(`• ${cleanBulletLabel(b)}`, W - 30)
      doc.text(lines, 18, y)
      y += lines.length * 7 + 3
    })

    // Footer Candidate Name
    doc.setFontSize(9)
    doc.setTextColor(isDark ? 165 : 156, isDark ? 180 : 163, isDark ? 252 : 175)
    doc.text(deck.candidate_name, 14, H - 8)
    doc.text("infograph-ai", W - 14, H - 8, { align: "right" })
  })

  // Sanitize filename
  const safeName = deck.candidate_name.replace(/[^a-z0-9]/gi, '_').toLowerCase()
  doc.save(`${safeName}_deck.pdf`)
}
