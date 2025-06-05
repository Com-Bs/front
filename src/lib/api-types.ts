export interface CodeRunResult {
  results: Array<{
    status?: "Error" | "Success"
    error?: { message: string; line: number; column: number }
    output: [number] | null
    expected_output: [number]
  }>
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