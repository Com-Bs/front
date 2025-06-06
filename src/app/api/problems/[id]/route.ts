import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.BACKEND_API_URL || 'https://localhost:8080'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    // Get auth token from request headers
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Proxy to Go backend
    const backendResponse = await fetch(`${API_BASE_URL}/problems/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      }
    })

    // Read response as text first, then try to parse as JSON
    const responseText = await backendResponse.text()
    
    if (!backendResponse.ok) {
      // Try to parse error as JSON, fall back to plain text
      let errorMessage = "Failed to fetch problem"
      try {
        const errorData = JSON.parse(responseText)
        errorMessage = errorData.message || errorMessage
      } catch {
        // If it's not JSON, use the text response
        errorMessage = responseText || errorMessage
      }
      
      return NextResponse.json({ 
        success: false, 
        message: errorMessage
      }, { status: backendResponse.status })
    }

    // Try to parse successful response as JSON
    let data
    try {
      data = JSON.parse(responseText)
    } catch {
      // If response is not JSON, return error
      return NextResponse.json({ 
        success: false, 
        message: "Backend returned invalid JSON response" 
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      problem: data,
    })
  } catch (error) {
    console.error('Problem fetch error:', error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
