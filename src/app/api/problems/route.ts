import { NextResponse } from "next/server"

const mockProblems = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
    ],
    testCases: [
      { id: 1, input: "[2,7,11,15], 9", expectedOutput: "[0,1]", status: "pending" },
      { id: 2, input: "[3,2,4], 6", expectedOutput: "[1,2]", status: "pending" },
    ],
  },
  {
    id: 2,
    title: "Add Two Numbers",
    difficulty: "Medium",
    description: "You are given two non-empty linked lists representing two non-negative integers.",
    examples: [
      {
        input: "l1 = [2,4,3], l2 = [5,6,4]",
        output: "[7,0,8]",
        explanation: "342 + 465 = 807.",
      },
    ],
    testCases: [{ id: 1, input: "[2,4,3], [5,6,4]", expectedOutput: "[7,0,8]", status: "pending" }],
  },
]

export async function GET() {
  return NextResponse.json({
    success: true,
    problems: mockProblems,
  })
}
