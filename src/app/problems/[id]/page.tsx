"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/navbar";
import {
  Play,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiClient } from "@/lib/api";
import type { CodeRunResult, Problem, UserSolution } from "@/lib/api-types";

interface TestCase {
  id: number;
  input: string;
  expectedOutput: string;
  status: "pending" | "passed" | "failed";
}

interface ProblemWithTestStatus extends Problem {
  testCases: TestCase[];
}

export default function ProblemPage() {
  const params = useParams();
  const problemId = params?.id as string;

  const [isTestPanelOpen, setIsTestPanelOpen] = useState(true);
  const [isSolutionsPanelOpen, setIsSolutionsPanelOpen] = useState(false);
  const [currentProblem, setCurrentProblem] =
    useState<ProblemWithTestStatus | null>(null);
  const [previousSolutions, setPreviousSolutions] = useState<UserSolution[]>(
    []
  );
  const [isLoadingSolutions, setIsLoadingSolutions] = useState(false);
  const [code, setCode] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [leftWidth, setLeftWidth] = useState(50); // percentage
  const [isResizing, setIsResizing] = useState(false);
  const [outputHeight, setOutputHeight] = useState(30); // percentage of right panel
  const [isResizingVertical, setIsResizingVertical] = useState(false);
  const [results, setResults] = useState<CodeRunResult | null>(null);
  const [mobileView, setMobileView] = useState<"problem" | "code">("problem");
  const [isDesktop, setIsDesktop] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  // Check if desktop
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // Fetch problem from API
  useEffect(() => {
    const fetchProblem = async () => {
      if (!problemId) return;

      try {
        const data = await apiClient.getProblem(problemId);

        if (data.success && data.problem) {
          const problemWithTests: ProblemWithTestStatus = {
            ...data.problem,
            difficulty: (data.problem.difficulty.charAt(0).toUpperCase() +
              data.problem.difficulty.slice(1).toLowerCase()) as
              | "Easy"
              | "Medium"
              | "Hard",
            testCases: data.problem.test_cases.map((tc, index) => ({
              id: index + 1,
              input: tc.input,
              expectedOutput: tc.output,
              status: "pending",
            })),
          };
          setCurrentProblem(problemWithTests);
          setCode(`    /* Write your solution here */
    `);
        }
      } catch (error) {
        console.error("Failed to fetch problem:", error);
        setCurrentProblem(null);
      }
    };

    const fetchSolutions = async () => {
      if (!problemId) return;

      try {
        setIsLoadingSolutions(true);

        // Get user solutions from API
        const data = await apiClient.getUserSolutions(problemId);
        if (data.success) {
          setPreviousSolutions(data.solutions || []);
        } else {
          setPreviousSolutions([]);
        }
      } catch (error) {
        console.error("Failed to fetch solutions:", error);
        setPreviousSolutions([]);
      } finally {
        setIsLoadingSolutions(false);
      }
    };

    fetchProblem();
    fetchSolutions();
  }, [problemId]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleVerticalMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingVertical(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isResizing && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const newLeftWidth =
          ((e.clientX - containerRect.left) / containerRect.width) * 100;

        // Constrain between 20% and 80%
        const constrainedWidth = Math.min(Math.max(newLeftWidth, 20), 80);
        setLeftWidth(constrainedWidth);
      }

      if (isResizingVertical && rightPanelRef.current) {
        const rightPanelRect = rightPanelRef.current.getBoundingClientRect();
        const headerHeight = 57; // Approximate header height
        const availableHeight = rightPanelRect.height - headerHeight;
        const relativeY = e.clientY - rightPanelRect.top - headerHeight;
        const newOutputHeight =
          ((availableHeight - relativeY) / availableHeight) * 100;

        // Constrain between 15% and 70%
        const constrainedHeight = Math.min(Math.max(newOutputHeight, 15), 70);
        setOutputHeight(constrainedHeight);
      }
    },
    [isResizing, isResizingVertical]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    setIsResizingVertical(false);
  }, []);

  useEffect(() => {
    if (isResizing || isResizingVertical) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.classList.add(
        isResizing ? "cursor-col-resize" : "cursor-row-resize"
      );
      document.body.classList.add("select-none-body");
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.classList.remove(
        "cursor-col-resize",
        "cursor-row-resize",
        "select-none-body"
      );
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.classList.remove(
        "cursor-col-resize",
        "cursor-row-resize",
        "select-none-body"
      );
    };
  }, [isResizing, isResizingVertical, handleMouseMove, handleMouseUp]);

  // Helper function to wrap user code with function signature
  const wrapCodeWithSignature = (
    userCode: string,
    problem: Problem
  ): string => {
    if (!problem.function_name || !problem.arguments) {
      // If no function signature provided, return user code as-is
      return userCode;
    }

    const functionName = problem.function_name;
    const params = problem.arguments
      .map((arg) => `${arg.type} ${arg.name}`)
      .join(", ");

    // Wrap user code in the required function signature (C minus always returns int)
    return `int ${functionName}(${params}) {
${userCode}
}`;
  };

  // Helper function to unwrap function body from stored code
  const unwrapFunctionBody = (
    wrappedCode: string,
    problem: Problem
  ): string => {
    if (!problem.function_name || !problem.arguments) {
      return wrappedCode;
    }

    const functionName = problem.function_name;
    const params = problem.arguments
      .map((arg) => `${arg.type} ${arg.name}`)
      .join(", ");
    const expectedSignature = `int ${functionName}(${params}) {`;

    // Check if the code starts with the expected function signature
    if (wrappedCode.startsWith(expectedSignature)) {
      // Remove the signature and closing brace, extract the body
      const bodyStartIndex = expectedSignature.length;
      let body = wrappedCode.substring(bodyStartIndex);

      // Remove the last closing brace if it exists
      const lastBraceIndex = body.lastIndexOf("}");
      if (lastBraceIndex !== -1) {
        body = body.substring(0, lastBraceIndex);
      }

      // Clean up leading/trailing whitespace but preserve internal formatting
      return body.trim();
    }

    // If it doesn't match expected format, return as-is
    return wrappedCode;
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle Tab key for indentation
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      // Insert tab character
      const newValue = code.substring(0, start) + "    " + code.substring(end);
      setCode(newValue);

      // Set cursor position after the inserted tab
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
    }

    // Handle Cmd+Enter (Mac) or Ctrl+Enter (Windows/Linux) to run code
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      if (!isRunning) {
        handleRunCode();
      }
    }
  };

  // Calculate line numbers based on code content
  const getLineNumbers = () => {
    const lines = code.split("\n").length;
    return Array.from({ length: Math.max(lines, 10) }, (_, i) => i + 1);
  };

  // Handle scroll synchronization between textarea and line numbers
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (lineNumbersRef.current && textareaRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setResults(null);

    try {
      // Wrap user code with function signature if available
      const wrappedCode = currentProblem
        ? wrapCodeWithSignature(code, currentProblem)
        : code;
      const data = await apiClient.runCode(wrappedCode, problemId);
      setResults(data);

      if (currentProblem && data.result) {
        const updatedTestCases = currentProblem.testCases.map(
          (testCase, index) => ({
            ...testCase,
            status:
              data.result && data.result[index]?.status === "Success"
                ? "passed"
                : ("failed" as "passed" | "failed"),
          })
        );

        setCurrentProblem({
          ...currentProblem,
          testCases: updatedTestCases,
        });
      }

      // Refresh previous solutions after compile
      if (problemId) {
        try {
          const data = await apiClient.getUserSolutions(problemId);
          if (data.success) {
            setPreviousSolutions(data.solutions || []);
          }
        } catch (error) {
          console.error("Failed to refresh solutions:", error);
        }
      }
    } catch (error) {
      console.error("Failed to run code:", error);
    }

    setIsRunning(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "passed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "partial":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="h-screen bg-[#F7EBEC] dark:bg-[#1D1E2C] flex flex-col">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white dark:bg-[#2A2B3D] px-4 py-2 lg:border-b lg:border-[#DDBDD5]/30">
        <div className="flex items-center gap-2">
          <Link href="/app">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Problems</span>
            </Button>
          </Link>
          <span className="text-sm text-[#59656F] dark:text-[#DDBDD5]">
            {currentProblem ? currentProblem.title : "Problem"}
          </span>
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden bg-white dark:bg-[#2A2B3D] px-2 pt-2 shadow-none -mt-px">
        <div className="flex gap-1">
          <button
            onClick={() => setMobileView("problem")}
            className={`flex-1 px-4 text-sm font-medium transition-all duration-200 rounded-t-lg relative ${
              mobileView === "problem"
                ? "py-4 bg-white dark:bg-[#2A2B3D] text-[#1D1E2C] dark:text-white border-x border-t border-[#DDBDD5]/30 -mb-px z-10 shadow-[-4px_-2px_8px_-4px_rgba(0,0,0,0.15),4px_-2px_8px_-4px_rgba(0,0,0,0.15),0_-4px_8px_-4px_rgba(0,0,0,0.15)]"
                : "py-3 bg-[#DDBDD5]/30 dark:bg-[#59656F]/30 text-[#59656F] dark:text-[#DDBDD5] hover:bg-[#DDBDD5]/50 dark:hover:bg-[#59656F]/50 border-x border-t border-[#DDBDD5]/20 mt-1"
            }`}
          >
            Problem
          </button>
          <button
            onClick={() => setMobileView("code")}
            className={`flex-1 px-4 text-sm font-medium transition-all duration-200 rounded-t-lg relative ${
              mobileView === "code"
                ? "py-4 bg-white dark:bg-[#2A2B3D] text-[#1D1E2C] dark:text-white border-x border-t border-[#DDBDD5]/30 -mb-px z-10 shadow-[-4px_-2px_8px_-4px_rgba(0,0,0,0.15),4px_-2px_8px_-4px_rgba(0,0,0,0.15),0_-4px_8px_-4px_rgba(0,0,0,0.15)]"
                : "py-3 bg-[#DDBDD5]/30 dark:bg-[#59656F]/30 text-[#59656F] dark:text-[#DDBDD5] hover:bg-[#DDBDD5]/50 dark:hover:bg-[#59656F]/50 border-x border-t border-[#DDBDD5]/20 mt-1"
            }`}
          >
            Code
          </button>
        </div>
      </div>

      <div
        className="flex-1 flex flex-col lg:flex-row overflow-hidden"
        ref={containerRef}
      >
        {/* Problem Description & Test Cases */}
        <div
          className={`flex flex-col lg:border-r border-[#DDBDD5]/30 ${
            isDesktop ? "" : "flex-1"
          } ${mobileView === "code" ? "hidden lg:flex" : "flex"}`}
          style={{ width: isDesktop ? `${leftWidth}%` : undefined }}
        >
          {/* Problem Description */}
          <div className="flex-1 overflow-auto p-6 bg-white dark:bg-[#2A2B3D]">
            {currentProblem ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-[#1D1E2C] dark:text-white">
                    {currentProblem.title}
                  </h1>
                  <Badge
                    className={getDifficultyColor(currentProblem.difficulty)}
                  >
                    {currentProblem.difficulty}
                  </Badge>
                </div>

                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-[#59656F] dark:text-[#DDBDD5] leading-relaxed">
                    {currentProblem.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#1D1E2C] dark:text-white">
                    Examples
                  </h3>
                  {currentProblem.test_cases.slice(0, 2).map((tc, index) => (
                    <div
                      key={index}
                      className="bg-[#F7EBEC] dark:bg-[#1D1E2C] rounded-lg p-4"
                    >
                      <div className="space-y-2">
                        <div>
                          <span className="font-medium text-[#1D1E2C] dark:text-white">
                            Input:{" "}
                          </span>
                          <code className="text-[#AC9FBB]">{tc.input}</code>
                        </div>
                        <div>
                          <span className="font-medium text-[#1D1E2C] dark:text-white">
                            Output:{" "}
                          </span>
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
                  <p className="text-[#59656F] dark:text-[#DDBDD5]">
                    Loading problem...
                  </p>
                  <p className="text-sm text-[#59656F] dark:text-[#DDBDD5] mt-2">
                    If this takes too long, the problem might not exist or
                    there&apos;s a backend issue.
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
                  <h3 className="font-medium text-[#1D1E2C] dark:text-white">
                    Test Cases
                  </h3>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isTestPanelOpen ? "rotate-90" : ""
                    }`}
                  />
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
                      {testCase.status === "pending" && (
                        <Clock className="w-4 h-4 text-[#59656F]" />
                      )}
                      {testCase.status === "passed" && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                      {testCase.status === "failed" && (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-[#1D1E2C] dark:text-white">
                        Test Case {testCase.id}
                      </div>
                      <div className="text-xs text-[#59656F] dark:text-[#DDBDD5] truncate">
                        Input: {testCase.input}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Previous Solutions Panel */}
          <Collapsible
            open={isSolutionsPanelOpen}
            onOpenChange={setIsSolutionsPanelOpen}
          >
            <CollapsibleTrigger asChild>
              <div className="bg-[#DDBDD5]/20 dark:bg-[#59656F]/20 border-t border-[#DDBDD5]/30 p-3 cursor-pointer hover:bg-[#DDBDD5]/30 dark:hover:bg-[#59656F]/30">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-[#1D1E2C] dark:text-white">
                    Previous Solutions ({previousSolutions.length})
                  </h3>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isSolutionsPanelOpen ? "rotate-90" : ""
                    }`}
                  />
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="bg-white dark:bg-[#2A2B3D] p-4 max-h-48 lg:max-h-64 overflow-auto custom-scrollbar">
                {isLoadingSolutions ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#AC9FBB]"></div>
                    <span className="ml-2 text-[#59656F] dark:text-[#DDBDD5] text-sm">
                      Loading solutions...
                    </span>
                  </div>
                ) : previousSolutions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-[#59656F] dark:text-[#DDBDD5] text-sm">
                      No previous solutions found
                    </p>
                    <p className="text-xs text-[#59656F] dark:text-[#DDBDD5] mt-1">
                      Submit your first solution to see it here!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {previousSolutions.map((solution, index) => (
                      <div
                        key={solution.id}
                        className="border border-[#DDBDD5]/30 rounded-lg p-3 hover:bg-[#F7EBEC] dark:hover:bg-[#1D1E2C] transition-colors cursor-pointer"
                        onClick={() =>
                          setCode(
                            currentProblem
                              ? unwrapFunctionBody(
                                  solution.code,
                                  currentProblem
                                )
                              : solution.code
                          )
                        }
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-[#1D1E2C] dark:text-white">
                              Solution #{previousSolutions.length - index}
                            </span>
                            <div
                              className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                                solution.status
                              )}`}
                            >
                              {solution.status}
                            </div>
                          </div>
                          <span className="text-xs text-[#59656F] dark:text-[#DDBDD5]">
                            {formatDate(solution.submittedAt)}
                          </span>
                        </div>

                        {solution.testResults && (
                          <div className="flex items-center gap-4 text-xs text-[#59656F] dark:text-[#DDBDD5]">
                            <span>
                              Tests: {solution.testResults.passed}/
                              {solution.testResults.total}
                            </span>
                            {solution.executionTime && (
                              <span>Time: {solution.executionTime}</span>
                            )}
                          </div>
                        )}

                        <div className="text-xs text-[#AC9FBB] mt-2 text-right">
                          Click to load this solution
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Resizable Divider - Desktop Only */}
        <div
          className="hidden lg:flex w-1 bg-[#DDBDD5]/30 hover:bg-[#AC9FBB]/50 cursor-col-resize transition-colors duration-150 items-center justify-center group"
          onMouseDown={handleMouseDown}
        >
          <div className="w-0.5 h-8 bg-[#DDBDD5] group-hover:bg-[#AC9FBB] transition-colors duration-150 rounded-full"></div>
        </div>

        {/* Code Editor Panel */}
        <div
          className={`flex flex-col ${isDesktop ? "" : "flex-1"} ${
            mobileView === "problem" ? "hidden lg:flex" : "flex"
          }`}
          ref={rightPanelRef}
          style={{ width: isDesktop ? `${100 - leftWidth}%` : undefined }}
        >
          {/* Editor Header */}
          <div className="bg-white dark:bg-[#2A2B3D] border-b border-[#DDBDD5]/30 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#1D1E2C] dark:text-white">
                  C -{" "}
                </span>
                <span className="text-xs text-[#59656F] dark:text-[#DDBDD5] hidden sm:inline">
                  Press Tab for indentation, Cmd+Enter to run
                </span>
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
          <div
            className={`bg-[#F7EBEC] dark:bg-[#1D1E2C] p-4 ${
              isDesktop ? "" : "flex-[3]"
            } min-h-0 flex flex-col`}
            style={{ height: isDesktop ? `${100 - outputHeight}%` : undefined }}
          >
            {/* Function Signature (Read-only) */}
            {currentProblem?.function_name && currentProblem?.arguments && (
              <div className="mb-2">
                <div
                  className="bg-[#DDBDD5]/20 border border-[#DDBDD5]/30 rounded p-2 text-[#1D1E2C] dark:text-white font-mono text-sm"
                  style={{
                    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                  }}
                >
                  {`int ${
                    currentProblem.function_name
                  }(${currentProblem.arguments
                    .map((arg) => `${arg.type} ${arg.name}`)
                    .join(", ")}) {`}
                </div>
              </div>
            )}

            {/* Function Body Editor */}
            <div className="flex-1 flex flex-col">
              <div className="flex-1 flex bg-[#DDBDD5]/10 dark:bg-[#59656F]/10 rounded border border-[#DDBDD5]/30">
                {/* Line Numbers */}
                <div
                  ref={lineNumbersRef}
                  className="bg-[#DDBDD5]/20 dark:bg-[#59656F]/20 px-2 py-2 text-right text-[#59656F] dark:text-[#DDBDD5] font-mono text-sm border-r border-[#DDBDD5]/30 overflow-hidden"
                  style={{
                    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                    width: "40px",
                    minWidth: "40px",
                  }}
                >
                  {getLineNumbers().map((lineNum) => (
                    <div key={lineNum} className="leading-5 h-5 select-none">
                      {lineNum}
                    </div>
                  ))}
                </div>

                {/* Code Editor */}
                <textarea
                  ref={textareaRef}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onScroll={handleScroll}
                  className="flex-1 bg-transparent text-[#1D1E2C] dark:text-white font-mono text-sm resize-none outline-none px-3 py-2 leading-5"
                  placeholder={
                    currentProblem?.function_name
                      ? "// Write your function body here..."
                      : "// Start coding here..."
                  }
                  style={{
                    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                    lineHeight: "20px",
                  }}
                />
              </div>
            </div>

            {/* Closing Brace (Read-only) */}
            {currentProblem?.function_name && currentProblem?.arguments && (
              <div
                className="bg-[#DDBDD5]/20 border border-[#DDBDD5]/30 rounded p-2 text-[#1D1E2C] dark:text-white font-mono text-sm mt-2"
                style={{
                  fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                }}
              >
                {`}`}
              </div>
            )}
          </div>

          {/* Horizontal Resizer - Desktop Only */}
          <div
            className="hidden lg:flex h-1 bg-[#DDBDD5]/30 hover:bg-[#AC9FBB]/50 cursor-row-resize transition-colors duration-150 items-center justify-center group"
            onMouseDown={handleVerticalMouseDown}
          >
            <div className="h-0.5 w-8 bg-[#DDBDD5] group-hover:bg-[#AC9FBB] transition-colors duration-150 rounded-full"></div>
          </div>

          {/* Output Panel */}
          <div
            className={`bg-white dark:bg-[#2A2B3D] p-4 flex flex-col border-t lg:border-t-0 border-[#DDBDD5]/30 ${
              isDesktop ? "" : "flex-1"
            } min-h-0`}
            style={{ height: isDesktop ? `${outputHeight}%` : undefined }}
          >
            <h4 className="font-medium text-[#1D1E2C] dark:text-white mb-2">
              Output
            </h4>
            <div className="bg-[#F7EBEC] dark:bg-[#1D1E2C] rounded p-3 flex-1 overflow-auto">
              {isRunning ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#AC9FBB]"></div>
                  <span className="text-[#59656F] dark:text-[#DDBDD5] text-sm">
                    Running tests...
                  </span>
                </div>
              ) : results?.result ? (
                <div className="space-y-2">
                  {/* Show compilation error if present */}
                  {results.error && (
                    <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 p-3 rounded mb-3">
                      <p className="font-medium">Compilation Error:</p>
                      <p className="text-sm mt-1">{results.error}</p>
                      {results.line && results.column && (
                        <p className="text-xs mt-1">
                          Line: {results.line}, Column: {results.column}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="text-[#1D1E2C] dark:text-white font-medium text-sm mb-2">
                    Test Results:{" "}
                    {results.status === "Success"
                      ? "All Passed ✓"
                      : results.error
                      ? "Compilation Failed"
                      : "Some Failed ✗"}
                  </div>
                  {results.result.map((testResult, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded text-sm ${
                        testResult.status === "Success"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                          : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">
                          Test Case {index + 1}: {testResult.status}
                        </span>
                        {testResult.status === "Success" ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                      </div>
                      <div className="mt-1 text-xs">
                        <span>Output: {testResult.output.join(", ")}</span>
                        {testResult.status === "Failed" &&
                          testResult.expectedOutput.length > 0 && (
                            <span className="ml-2">
                              Expected: {testResult.expectedOutput.join(", ")}
                            </span>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : results?.error ? (
                <div className="text-red-500 text-sm">
                  <p>Error: {results.error}</p>
                  {results.line && results.column && (
                    <p>
                      Line: {results.line}, Column: {results.column}
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-[#59656F] dark:text-[#DDBDD5] text-sm">
                  Click &quot;Run Code&quot; to see results
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
