"use client"
import { useRef, useState } from "react"

interface Props {
  onUpload: (file: File) => void
  loading: boolean
}

export default function InputForm({ onUpload, loading }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  function handleFile(file: File) {
    if (file.type !== "application/pdf") {
      alert("Only PDF files accepted")
      return
    }
    onUpload(file)
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragOver(false)
        const file = e.dataTransfer.files[0]
        if (file) handleFile(file)
      }}
      onClick={() => inputRef.current?.click()}
      style={{
        border: `2px dashed ${dragOver ? "#6366f1" : "#d1d5db"}`,
        borderRadius: 12,
        padding: "2rem",
        textAlign: "center",
        cursor: "pointer",
        background: dragOver ? "#eef2ff" : "#fafafa",
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />
      <p style={{ margin: 0, color: "#6b7280" }}>
        {loading ? "Parsing…" : "Drop your resume PDF here or click to browse"}
      </p>
    </div>
  )
}


// You correctly separated:

// upload UI
// upload logic
// state ownership
