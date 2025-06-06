import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.BACKEND_API_URL || 'https://localhost:8080'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ 
        success: false, 
        message: "Email and password are required" 
      }, { status: 400 })
    }

    // Proxy to Go backend - map email to username for backend compatibility
    const backendResponse = await fetch(`${API_BASE_URL}/logIn`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        username: email, // Using email as username for compatibility
        password 
      })
    })

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text()
      let errorMessage = "Invalid credentials"
      
      try {
        const errorData = JSON.parse(errorText)
        errorMessage = errorData.message || errorMessage
      } catch {
        // If response is not JSON, use default message
      }

      return NextResponse.json({ 
        success: false, 
        message: errorMessage
      }, { status: backendResponse.status })
    }

    const data = await backendResponse.json()

    // Transform backend response to match frontend expectations
    return NextResponse.json({
      success: true,
      user: {
        id: 1,
        email: email,
        name: email,
      },
      token: data.token,
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
