"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { Play, ChevronRight, CheckCircle, XCircle, Clock, ArrowLeft } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import Link from "next/link"
import { useParams } from "next/navigation"
import { apiClient } from "@/lib/api"
import type { CodeRunResult, Problem } from "@/lib/api-types"

interface TestCase {
  id: number
  input: string
  expectedOutput: string
  status: "pending" | "passed" | "failed"
}

interface ProblemWithTestStatus extends Problem {
  testCases: TestCase[]
}

export default function ProblemPage() {
  const params = useParams()
  const problemId = params?.id as string

  const [isTestPanelOpen, setIsTestPanelOpen] = useState(true)
  const [currentProblem, setCurrentProblem] = useState<ProblemWithTestStatus | null>(null)
  const [code, setCode] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [leftWidth, setLeftWidth] = useState(50) // percentage
  const [isResizing, setIsResizing] = useState(false)
  const [outputHeight, setOutputHeight] = useState(30) // percentage of right panel
  const [isResizingVertical, setIsResizingVertical] = useState(false)
  const [results, setResults] = useState<CodeRunResult["results"] | null>(null)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const rightPanelRef = useRef<HTMLDivElement>(null)

  // Fetch problem from API
  useEffect(() => {
    const fetchProblem = async () => {
      if (!problemId) return
      
      try {
        const data = await apiClient.getProblem(problemId)
        
        if (data.success && data.problem) {
          const problemWithTests: ProblemWithTestStatus = {
            ...data.problem,
            difficulty: data.problem.difficulty.charAt(0).toUpperCase() + data.problem.difficulty.slice(1).toLowerCase() as "Easy" | "Medium" | "Hard",
            testCases: data.problem.test_cases.map((tc, index) => ({
              id: index + 1,
              input: tc.input,
              expectedOutput: tc.output,
              status: "pending"
            }))
          }
          setCurrentProblem(problemWithTests)
          setCode(`function solution() {
    // Write your solution here
    
}`)
        }
      } catch (error) {
        console.error('Failed to fetch problem:', error)
        setCurrentProblem(null)
      }
    }

    fetchProblem()
  }, [problemId])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }, [])

  const handleVerticalMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizingVertical(true)
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isResizing && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect()
      const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100
      
      // Constrain between 20% and 80%
      const constrainedWidth = Math.min(Math.max(newLeftWidth, 20), 80)
      setLeftWidth(constrainedWidth)
    }
    
    if (isResizingVertical && rightPanelRef.current) {
      const rightPanelRect = rightPanelRef.current.getBoundingClientRect()
      const headerHeight = 57 // Approximate header height
      const availableHeight = rightPanelRect.height - headerHeight
      const relativeY = e.clientY - rightPanelRect.top - headerHeight
      const newOutputHeight = ((availableHeight - relativeY) / availableHeight) * 100
      
      // Constrain between 15% and 70%
      const constrainedHeight = Math.min(Math.max(newOutputHeight, 15), 70)
      setOutputHeight(constrainedHeight)
    }
  }, [isResizing, isResizingVertical])

  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
    setIsResizingVertical(false)
  }, [])

  useEffect(() => {
    if (isResizing || isResizingVertical) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.classList.add(isResizing ? 'cursor-col-resize' : 'cursor-row-resize')
      document.body.classList.add('select-none-body')
    } else {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.classList.remove('cursor-col-resize', 'cursor-row-resize', 'select-none-body')
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.classList.remove('cursor-col-resize', 'cursor-row-resize', 'select-none-body')
    }
  }, [isResizing, isResizingVertical, handleMouseMove, handleMouseUp])

  const handleRunCode = async () => {
    setIsRunning(true)
    setResults(null)

    try {
      const data = await apiClient.runCode(code, problemId)
      setResults(data.results)
      
      if (currentProblem) {
        const updatedTestCases = currentProblem.testCases.map((testCase, index) => ({
          ...testCase,
          status: data.results[index]?.status === "Success" ? "passed" : "failed" as "passed" | "failed",
        }))

        setCurrentProblem({
          ...currentProblem,
          testCases: updatedTestCases,
        })
      }
    } catch (error) {
      console.error('Failed to run code:', error)
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
      <Navbar />
      
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-[#2A2B3D] border-b border-[#DDBDD5]/30 px-4 py-2">
        <div className="flex items-center gap-2">
          <Link href="/app">
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              <span>Problems</span>
            </Button>
          </Link>
          <span className="text-sm text-[#59656F] dark:text-[#DDBDD5]">
            {currentProblem ? currentProblem.title : "Problem"}
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Problem Description & Test Cases */}
        <div className="flex flex-col lg:border-r border-[#DDBDD5]/30 lg:w-1/2">
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
                  {currentProblem.test_cases.slice(0, 2).map((tc, index) => (
                    <div key={index} className="bg-[#F7EBEC] dark:bg-[#1D1E2C] rounded-lg p-4">
                      <div className="space-y-2">
                        <div>
                          <span className="font-medium text-[#1D1E2C] dark:text-white">Input: </span>
                          <code className="text-[#AC9FBB]">{tc.input}</code>
                        </div>
                        <div>
                          <span className="font-medium text-[#1D1E2C] dark:text-white">Output: </span>
                          <code className="text-[#AC9FBB]">{tc.output}</code>
                        </div>
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
                  <p className="text-sm text-[#59656F] dark:text-[#DDBDD5] mt-2">
                    If this takes too long, the problem might not exist or there&apos;s a backend issue.
                  </p>
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

        {/* Code Editor Panel */}
        <div className="flex flex-col lg:w-1/2">
          {/* Editor Header */}
          <div className="bg-white dark:bg-[#2A2B3D] border-b border-[#DDBDD5]/30 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#1D1E2C] dark:text-white">C - </span>
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

          {/* Code Editor */}
          <div className="bg-[#1D1E2C] p-4 flex-1 min-h-0">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full bg-transparent text-white font-mono text-sm resize-none outline-none"
              placeholder="// Start coding here..."
              style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace' }}
            />
          </div>

          {/* Output Panel */}
          <div className="bg-white dark:bg-[#2A2B3D] p-4 flex flex-col h-48 border-t border-[#DDBDD5]/30">
            <h4 className="font-medium text-[#1D1E2C] dark:text-white mb-2">Output</h4>
            <div className="bg-[#F7EBEC] dark:bg-[#1D1E2C] rounded p-3 flex-1 overflow-auto">
              {isRunning ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#AC9FBB]"></div>
                  <span className="text-[#59656F] dark:text-[#DDBDD5] text-sm">Running tests...</span>
                </div>
              ) : results?.some(r => r.error) ? (
                <div className="text-red-500 text-sm">
                  {results.find(r => r.error)?.error && (
                    <>
                      <p>Error: {results.find(r => r.error)?.error?.message}</p>
                      <p>Line: {results.find(r => r.error)?.error?.line}, Column: {results.find(r => r.error)?.error?.column}</p>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-[#59656F] dark:text-[#DDBDD5] text-sm">Click &quot;Run Code&quot; to see results</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}