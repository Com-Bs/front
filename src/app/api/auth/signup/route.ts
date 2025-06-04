import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.BACKEND_API_URL || 'https://localhost:8443'

export async function POST(request: NextRequest) {
  try {
    const { email, password, username } = await request.json()

    // Proxy to Go backend
    const backendResponse = await fetch(`${API_BASE_URL}/signUp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        username: username || email, // Use username if provided, otherwise use email
        email: email,
        password 
      })
    })

    const data = await backendResponse.json()

    if (!backendResponse.ok) {
      return NextResponse.json({ 
        success: false, 
        message: data.message || "Registration failed" 
      }, { status: backendResponse.status })
    }

    // Transform backend response to match frontend expectations
    return NextResponse.json({
      success: true,
      user: {
        username: data.username,
        email: email,
      },
      message: data.message,
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}