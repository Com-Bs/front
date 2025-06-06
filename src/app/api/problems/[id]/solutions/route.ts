import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.BACKEND_API_URL || 'https://localhost:8080'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Get auth token from request headers
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Proxy to Go backend
    const backendUrl = `${API_BASE_URL}/problems/${id}/solutions`
    console.log('Frontend sending request to:', backendUrl)
    console.log('With headers:', { Authorization: authHeader?.substring(0, 20) + '...' })
    
    const backendResponse = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    })

    console.log('Backend response status:', backendResponse.status)
    console.log('Backend response headers:', Object.fromEntries(backendResponse.headers.entries()))

    // Parse response as JSON regardless of status
    let data
    let responseText
    try {
      responseText = await backendResponse.text()
      console.log('Backend raw response:', responseText)
      data = JSON.parse(responseText)
      console.log('Backend parsed response:', data)
    } catch (parseError) {
      console.error('Failed to parse backend response as JSON:', parseError)
      console.error('Raw response that failed to parse:', responseText)
      return NextResponse.json({ 
        success: false, 
        message: "Backend returned invalid response" 
      }, { status: 500 })
    }

    // Pass through backend response with original status
    return NextResponse.json(data, { status: backendResponse.status })
  } catch (error) {
    console.error('Get solutions error:', error)
    return NextResponse.json({ success: false, message: "Failed to get solutions" }, { status: 500 })
  }
}