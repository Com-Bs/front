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

    const data = await backendResponse.json()

    if (!backendResponse.ok) {
      return NextResponse.json({ 
        success: false, 
        message: "Code execution failed" 
      }, { status: backendResponse.status })
    }

    // Transform response to match frontend expectations
    return NextResponse.json({
      success: true,
      results: data.results || [],
      allTestsPassed: data.allTestsPassed || false,
      totalExecutionTime: data.totalExecutionTime || "0ms",
      memoryUsage: data.memoryUsage || "0 MB",
    })
  } catch (error) {
    console.error('Code execution error:', error)
    return NextResponse.json({ success: false, message: "Code execution failed" }, { status: 500 })
  }
}
