export interface CodeRunResult {
  result: Array<{
    status: "Success" | "Failed"
    output: number[]
    expectedOutput: number[]
  }>
  error?: string
  status?: "Success" | "Error"
  line?: number
  column?: number
}

export interface Problem {
  id: string
  title: string
  difficulty: "Easy" | "Medium" | "Hard"
  description: string
  hints: string[]
  test_cases: Array<{ input: string; output: string }>
  created_at: string
  updated_at: string
}

export interface ProblemResponse {
  success: boolean
  problem: Problem
}

// User Solution Types
export interface UserSolution {
  id: string
  problemId: string
  userId: string
  code: string
  status: "pending" | "passed" | "failed" | "partial"
  testResults?: {
    passed: number
    total: number
    details?: Array<{
      testCaseId: number
      status: "passed" | "failed"
      expectedOutput: string
      actualOutput: string
      executionTime?: string
    }>
  }
  submittedAt: string
  executionTime?: string
  memoryUsage?: string
}

export interface UserSolutionsRequest {
  userId?: string // Optional since it comes from JWT
  problemId: string
}

export interface UserSolutionsResponse {
  success: boolean
  solutions: UserSolution[]
  totalSolutions: number
  problem?: Problem // Include problem info for context
} 