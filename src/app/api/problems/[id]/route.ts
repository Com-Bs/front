import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const problemId = Number.parseInt(params.id)

  // Mock problem data
  const mockProblem = {
    id: problemId,
    title: "Two Sum",
    difficulty: "Easy",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
      },
    ],
    testCases: [
      { id: 1, input: "[2,7,11,15], 9", expectedOutput: "[0,1]", status: "pending" },
      { id: 2, input: "[3,2,4], 6", expectedOutput: "[1,2]", status: "pending" },
      { id: 3, input: "[3,3], 6", expectedOutput: "[0,1]", status: "pending" },
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
    // Write your solution here
    
}`,
      python: `def twoSum(nums, target):
    # Write your solution here
    pass`,
      java: `public int[] twoSum(int[] nums, int target) {
    // Write your solution here
    
}`,
    },
  }

  return NextResponse.json({
    success: true,
    problem: mockProblem,
  })
}
