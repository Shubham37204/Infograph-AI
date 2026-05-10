import { NextRequest, NextResponse } from "next/server"

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:8000"

export async function POST(req: NextRequest) {
  const form = await req.formData()

  const res = await fetch(`${BACKEND}/api/pipeline`, {
    method: "POST",
    body: form,
  })

  const contentType = res.headers.get("content-type") ?? ""
  const data = contentType.includes("application/json")
    ? await res.json()
    : { detail: await res.text() }

  return NextResponse.json(data, { status: res.status })
}


// You used:
// Next.js API proxy layer
// Advantages:
// backend hidden
// deployment flexibility
// centralized API handling
// future auth support