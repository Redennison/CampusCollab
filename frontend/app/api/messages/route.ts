// app/api/messages/route.ts
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const matchId = searchParams.get("matchId")
  if (!matchId) {
    return NextResponse.json({ error: "Missing matchId" }, { status: 400 })
  }

  // Forward to backend
  const token = request.headers.get("authorization")
  const response = await fetch(
    `http://localhost:8000/messages?matchId=${matchId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: token } : {}),
      },
    }
  )

  if (!response.ok) {
    const errorText = await response.text()
    return NextResponse.json({ error: errorText }, { status: response.status })
  }

  const data = await response.json()
  return NextResponse.json(data)
}
