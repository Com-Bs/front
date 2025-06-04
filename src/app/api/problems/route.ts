import { NextResponse } from "next/server"

const mockProblems = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    tags: ["Array", "Hash Table"],
    solvedCount: 4582,
    acceptanceRate: "72%",
  },
  {
    id: 2,
    title: "Add Two Numbers",
    difficulty: "Medium",
    description: "You are given two non-empty linked lists representing two non-negative integers.",
    tags: ["Linked List", "Math", "Recursion"],
    solvedCount: 2341,
    acceptanceRate: "65%",
  },
  {
    id: 3,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    description: "Find the length of the longest substring without repeating characters.",
    tags: ["Hash Table", "String", "Sliding Window"],
    solvedCount: 1987,
    acceptanceRate: "58%",
  },
  {
    id: 4,
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    description: "Find the median of the two sorted arrays.",
    tags: ["Array", "Binary Search", "Divide and Conquer"],
    solvedCount: 876,
    acceptanceRate: "42%",
  },
  {
    id: 5,
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    description: "Find the longest palindromic substring in s.",
    tags: ["String", "Dynamic Programming"],
    solvedCount: 1654,
    acceptanceRate: "61%",
  },
  {
    id: 6,
    title: "ZigZag Conversion",
    difficulty: "Medium",
    description: "Convert a string into a zigzag pattern on a given number of rows.",
    tags: ["String"],
    solvedCount: 1123,
    acceptanceRate: "54%",
  },
  {
    id: 7,
    title: "Reverse Integer",
    difficulty: "Medium",
    description: "Given a signed 32-bit integer x, return x with its digits reversed.",
    tags: ["Math"],
    solvedCount: 2876,
    acceptanceRate: "68%",
  },
  {
    id: 8,
    title: "String to Integer (atoi)",
    difficulty: "Medium",
    description: "Convert a string to a 32-bit signed integer.",
    tags: ["String", "Math"],
    solvedCount: 1432,
    acceptanceRate: "49%",
  },
  {
    id: 9,
    title: "Palindrome Number",
    difficulty: "Easy",
    description: "Determine whether an integer is a palindrome.",
    tags: ["Math"],
    solvedCount: 3654,
    acceptanceRate: "81%",
  },
  {
    id: 10,
    title: "Regular Expression Matching",
    difficulty: "Hard",
    description: "Implement regular expression matching with support for '.' and '*'.",
    tags: ["String", "Dynamic Programming", "Recursion"],
    solvedCount: 543,
    acceptanceRate: "32%",
  },
]

export async function GET() {
  return NextResponse.json({
    success: true,
    problems: mockProblems,
  })
}
