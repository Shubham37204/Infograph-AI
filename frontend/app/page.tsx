"use client"

import { useState } from "react"
import InputForm from "@/components/InputForm"
import { uploadResume } from "@/lib/api"
import { SlideDeckResponse } from "@/lib/types"

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [deck, setDeck] = useState<SlideDeckResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleUpload(file: File) {
    setLoading(true)
    setError(null)
    setDeck(null)
    try {
      setDeck(await uploadResume(file))
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ maxWidth: 720, margin: "4rem auto", padding: "0 1rem" }}>
      <h1 style={{ marginBottom: "1.5rem" }}>infograph-ai</h1>

      <InputForm onUpload={handleUpload} loading={loading} />

      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}

      {deck && (
        <div style={{ marginTop: "2rem" }}>
          <h2>{deck.candidate_name}</h2>
          {deck.slides.map((slide) => (
            <div key={slide.type} style={{
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              padding: "1rem",
              marginBottom: "1rem",
            }}>
              <h3 style={{ margin: "0 0 0.5rem" }}>{slide.title}</h3>
              <p style={{ margin: "0 0 0.5rem", color: "#6b7280" }}>{slide.body}</p>
              <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
                {slide.bullets.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
