import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    await request.json() // Extract parameters when needed

    // Mock code execution
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock test results
    const mockResults = [
      { testCaseId: 1, status: "passed", output: "[0,1]", executionTime: "2ms" },
      { testCaseId: 2, status: "passed", output: "[1,2]", executionTime: "1ms" },
      {
        testCaseId: 3,
        status: Math.random() > 0.5 ? "passed" : "failed",
        output: Math.random() > 0.5 ? "[0,1]" : "null",
        executionTime: "3ms",
      },
    ]

    const allPassed = mockResults.every((result) => result.status === "passed")

    return NextResponse.json({
      success: true,
      results: mockResults,
      allTestsPassed: allPassed,
      totalExecutionTime: "6ms",
      memoryUsage: "14.2 MB",
    })
  } catch {
    return NextResponse.json({ success: false, message: "Code execution failed" }, { status: 500 })
  }
}
