import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.BACKEND_API_URL || 'https://localhost:8443'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Get auth token from request headers
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Proxy to Go backend
    const backendResponse = await fetch(`${API_BASE_URL}/compile`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })

    // Parse response as JSON regardless of status
    let data
    try {
      const responseText = await backendResponse.text()
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.error('Failed to parse backend response as JSON:', parseError)
      return NextResponse.json({ 
        success: false, 
        message: "Backend returned invalid response" 
      }, { status: 500 })
    }

    // Pass through backend response with original status
    return NextResponse.json(data, { status: backendResponse.status })
  } catch (error) {
    console.error('Code execution error:', error)
    return NextResponse.json({ success: false, message: "Code execution failed" }, { status: 500 })
  }
}
