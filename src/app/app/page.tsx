"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Logo } from "@/components/logo"
import { Play, ChevronLeft, ChevronRight, Settings, User, LogOut, CheckCircle, XCircle, Clock } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface TestCase {
  id: number
  input: string
  expectedOutput: string
  status: "pending" | "passed" | "failed"
}

interface Problem {
  id: number
  title: string
  difficulty: "Easy" | "Medium" | "Hard"
  description: string
  examples: Array<{
    input: string
    output: string
    explanation?: string
  }>
  testCases: TestCase[]
}

export default function AppPage() {
  const [isTestPanelOpen, setIsTestPanelOpen] = useState(true)
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null)
  const [code, setCode] = useState("")
  const [isRunning, setIsRunning] = useState(false)

  // Mock API call to fetch problem
  useEffect(() => {
    const fetchProblem = async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const mockProblem: Problem = {
        id: 1,
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
      }

      setCurrentProblem(mockProblem)
      setCode(`function twoSum(nums, target) {
    // Write your solution here
    
}`)
    }

    fetchProblem()
  }, [])

  const handleRunCode = async () => {
    setIsRunning(true)

    // Mock API call to run code
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock test results
    if (currentProblem) {
      const updatedTestCases = currentProblem.testCases.map((testCase) => ({
        ...testCase,
        status: Math.random() > 0.3 ? "passed" : ("failed" as "passed" | "failed"),
      }))

      setCurrentProblem({
        ...currentProblem,
        testCases: updatedTestCases,
      })
    }

    setIsRunning(false)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="h-screen bg-[#F7EBEC] dark:bg-[#1D1E2C] flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-[#2A2B3D] border-b border-[#DDBDD5]/30 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo size="sm" />
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-[#59656F] dark:text-[#DDBDD5]">Problem 1 of 150</span>
              <Button variant="ghost" size="sm">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <User className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Problem Description & Test Cases */}
        <div className="w-1/2 flex flex-col border-r border-[#DDBDD5]/30">
          {/* Problem Description */}
          <div className="flex-1 overflow-auto p-6 bg-white dark:bg-[#2A2B3D]">
            {currentProblem ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-[#1D1E2C] dark:text-white">{currentProblem.title}</h1>
                  <Badge className={getDifficultyColor(currentProblem.difficulty)}>{currentProblem.difficulty}</Badge>
                </div>

                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-[#59656F] dark:text-[#DDBDD5] leading-relaxed">{currentProblem.description}</p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#1D1E2C] dark:text-white">Examples</h3>
                  {currentProblem.examples.map((example, index) => (
                    <div key={index} className="bg-[#F7EBEC] dark:bg-[#1D1E2C] rounded-lg p-4">
                      <div className="space-y-2">
                        <div>
                          <span className="font-medium text-[#1D1E2C] dark:text-white">Input: </span>
                          <code className="text-[#AC9FBB]">{example.input}</code>
                        </div>
                        <div>
                          <span className="font-medium text-[#1D1E2C] dark:text-white">Output: </span>
                          <code className="text-[#AC9FBB]">{example.output}</code>
                        </div>
                        {example.explanation && (
                          <div>
                            <span className="font-medium text-[#1D1E2C] dark:text-white">Explanation: </span>
                            <span className="text-[#59656F] dark:text-[#DDBDD5]">{example.explanation}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#AC9FBB] mx-auto mb-4"></div>
                  <p className="text-[#59656F] dark:text-[#DDBDD5]">Loading problem...</p>
                </div>
              </div>
            )}
          </div>

          {/* Test Cases Panel */}
          <Collapsible open={isTestPanelOpen} onOpenChange={setIsTestPanelOpen}>
            <CollapsibleTrigger asChild>
              <div className="bg-[#DDBDD5]/20 dark:bg-[#59656F]/20 border-t border-[#DDBDD5]/30 p-3 cursor-pointer hover:bg-[#DDBDD5]/30 dark:hover:bg-[#59656F]/30">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-[#1D1E2C] dark:text-white">Test Cases</h3>
                  <ChevronRight className={`w-4 h-4 transition-transform ${isTestPanelOpen ? "rotate-90" : ""}`} />
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="bg-white dark:bg-[#2A2B3D] p-4 max-h-48 overflow-auto">
                {currentProblem?.testCases.map((testCase) => (
                  <div
                    key={testCase.id}
                    className="flex items-center gap-3 py-2 border-b border-[#DDBDD5]/20 last:border-b-0"
                  >
                    <div className="flex-shrink-0">
                      {testCase.status === "pending" && <Clock className="w-4 h-4 text-[#59656F]" />}
                      {testCase.status === "passed" && <CheckCircle className="w-4 h-4 text-green-500" />}
                      {testCase.status === "failed" && <XCircle className="w-4 h-4 text-red-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-[#1D1E2C] dark:text-white">Test Case {testCase.id}</div>
                      <div className="text-xs text-[#59656F] dark:text-[#DDBDD5] truncate">Input: {testCase.input}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="w-1/2 flex flex-col">
          {/* Editor Header */}
          <div className="bg-white dark:bg-[#2A2B3D] border-b border-[#DDBDD5]/30 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#1D1E2C] dark:text-white">JavaScript</span>
              </div>
              <Button
                onClick={handleRunCode}
                disabled={isRunning}
                className="bg-gradient-to-r from-[#AC9FBB] to-[#59656F] hover:from-[#DDBDD5] hover:to-[#AC9FBB] text-white"
              >
                <Play className="w-4 h-4 mr-2" />
                {isRunning ? "Running..." : "Run Code"}
              </Button>
            </div>
          </div>

          {/* Code Editor (Wireframe) */}
          <div className="flex-1 bg-[#1D1E2C] p-4">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full bg-transparent text-white font-mono text-sm resize-none outline-none"
              placeholder="// Start coding here..."
              style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace' }}
            />
          </div>

          {/* Output Panel */}
          <div className="bg-white dark:bg-[#2A2B3D] border-t border-[#DDBDD5]/30 p-4 h-32">
            <h4 className="font-medium text-[#1D1E2C] dark:text-white mb-2">Output</h4>
            <div className="bg-[#F7EBEC] dark:bg-[#1D1E2C] rounded p-3 h-20 overflow-auto">
              {isRunning ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#AC9FBB]"></div>
                  <span className="text-[#59656F] dark:text-[#DDBDD5] text-sm">Running tests...</span>
                </div>
              ) : (
                <div className="text-[#59656F] dark:text-[#DDBDD5] text-sm">Click "Run Code" to see results</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
