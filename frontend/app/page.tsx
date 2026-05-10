"use client"

import { useState } from "react"
import InputForm from "@/components/InputForm"
import SlideDeck from "@/components/SlideDeck"
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
    <main style={{ maxWidth: 680, margin: "4rem auto", padding: "0 1rem" }}>
      <h1 style={{ marginBottom: "0.25rem" }}>infograph-ai</h1>
      <p style={{ color: "#9ca3af", marginBottom: "1.5rem", fontSize: 14 }}>
        Drop your resume → get a 5-slide deck
      </p>

      <InputForm onUpload={handleUpload} loading={loading} />

      {loading && (
        <p style={{ textAlign: "center", color: "#6b7280", marginTop: "1.5rem" }}>
          Analysing resume…
        </p>
      )}

      {error && (
        <p style={{ color: "#ef4444", marginTop: "1rem" }}>{error}</p>
      )}

      {deck && <SlideDeck deck={deck} />}
    </main>
  )
}
