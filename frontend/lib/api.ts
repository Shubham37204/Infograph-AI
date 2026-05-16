import { SlideDeckResponse } from "@/lib/types"

export async function uploadResume(file: File): Promise<SlideDeckResponse> {
  const form = new FormData()
  form.append("file", file)

  const res = await fetch("/api/pipeline", {
    method: "POST",
    body: form,
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail ?? "Upload failed")
  }

  return res.json()
}


// Excellent abstraction.
// You isolated:
// networking logic
// from UI components.
// Very important architectural decision.