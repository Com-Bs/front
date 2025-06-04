import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Mock authentication logic
    if (email === "hello" && password === "hello123") {
      return NextResponse.json({
        success: true,
        user: {
          id: 1,
          email: "hello",
          name: "Demo User",
        },
        token: "mock-jwt-token",
      })
    }

    return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
  } catch {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
