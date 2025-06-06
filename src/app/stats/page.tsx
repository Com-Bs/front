"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/navbar";
import { ChevronLeft, TrendingUp, Clock, Target, Code } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";

interface Solution {
  id: string;
  problemId: string;
  userId: string;
  code: string;
  status: "passed" | "failed" | "partial" | "pending";
  submittedAt: string;
  executionTime?: string;
}

interface Stats {
  totalSubmissions: number;
  successRate: number;
  problemsAttempted: number;
  averageExecutionTime: number;
  statusDistribution: {
    passed: number;
    failed: number;
    partial: number;
    pending: number;
  };
  recentSubmissions: Solution[];
}

export default function StatsPage() {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getAllSolutions() {
      try {
        const resp = await apiClient.getAllUserSolutions();
        console.log("All user solutions:", resp);

        if (resp && resp.success && resp.solutions) {
          setSolutions(resp.solutions);
          calculateStats(resp.solutions);
        }
      } catch (error) {
        console.error("Failed to fetch solutions:", error);
      } finally {
        setIsLoading(false);
      }
    }
    getAllSolutions();
  }, []);

  const calculateStats = (solutions: Solution[]) => {
    const totalSubmissions = solutions.length;
    const passedSubmissions = solutions.filter(
      (s) => s.status === "passed"
    ).length;
    const successRate =
      totalSubmissions > 0 ? (passedSubmissions / totalSubmissions) * 100 : 0;

    // Count unique problems attempted
    const uniqueProblems = new Set(solutions.map((s) => s.problemId));
    const problemsAttempted = uniqueProblems.size;

    // Calculate average execution time
    const executionTimes = solutions
      .filter((s) => s.executionTime)
      .map((s) => parseFloat(s.executionTime!.replace("ms", "")));
    const averageExecutionTime =
      executionTimes.length > 0
        ? executionTimes.reduce((sum, time) => sum + time, 0) /
          executionTimes.length
        : 0;

    // Status distribution
    const statusDistribution = {
      passed: solutions.filter((s) => s.status === "passed").length,
      failed: solutions.filter((s) => s.status === "failed").length,
      partial: solutions.filter((s) => s.status === "partial").length,
      pending: solutions.filter((s) => s.status === "pending").length,
    };

    // Recent submissions (last 5)
    const recentSubmissions = [...solutions]
      .sort(
        (a, b) =>
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      )
      .slice(0, 5);

    setStats({
      totalSubmissions,
      successRate,
      problemsAttempted,
      averageExecutionTime,
      statusDistribution,
      recentSubmissions,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "passed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "partial":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "pending":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return (
      new Date(dateString).toLocaleDateString() +
      " " +
      new Date(dateString).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  return (
    <div className="bg-[#F7EBEC] dark:bg-[#1D1E2C] flex flex-col h-screen overflow-hidden">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col overflow-y-auto">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/app">
            <Button
              variant="outline"
              size="sm"
              className="border-[#DDBDD5]/50 hover:bg-[#DDBDD5]/20"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Problems
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-[#1D1E2C] dark:text-white mb-2">
              Statistics
            </h1>
            <p className="text-[#59656F] dark:text-[#DDBDD5]">
              Track your progress and performance
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white dark:bg-[#2A2B3D] rounded-lg shadow p-8 flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#AC9FBB] mx-auto mb-4"></div>
            <p className="text-[#59656F] dark:text-[#DDBDD5]">
              Loading statistics...
            </p>
          </div>
        ) : !stats ? (
          <div className="bg-white dark:bg-[#2A2B3D] rounded-lg shadow p-8 flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-[#1D1E2C] dark:text-white mb-2">
                No Data Available
              </h2>
              <p className="text-[#59656F] dark:text-[#DDBDD5]">
                Start solving problems to see your statistics here.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-[#2A2B3D] rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Code className="h-8 w-8 text-[#AC9FBB]" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-[#59656F] dark:text-[#DDBDD5]">
                      Total Submissions
                    </p>
                    <p className="text-2xl font-bold text-[#1D1E2C] dark:text-white">
                      {stats.totalSubmissions}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#2A2B3D] rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingUp className="h-8 w-8 text-green-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-[#59656F] dark:text-[#DDBDD5]">
                      Success Rate
                    </p>
                    <p className="text-2xl font-bold text-[#1D1E2C] dark:text-white">
                      {stats.successRate.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#2A2B3D] rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Target className="h-8 w-8 text-blue-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-[#59656F] dark:text-[#DDBDD5]">
                      Problems Attempted
                    </p>
                    <p className="text-2xl font-bold text-[#1D1E2C] dark:text-white">
                      {stats.problemsAttempted}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#2A2B3D] rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Clock className="h-8 w-8 text-orange-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-[#59656F] dark:text-[#DDBDD5]">
                      Avg Execution Time
                    </p>
                    <p className="text-2xl font-bold text-[#1D1E2C] dark:text-white">
                      {stats.averageExecutionTime.toFixed(1)}ms
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Status Distribution */}
              <div className="bg-white dark:bg-[#2A2B3D] rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-[#1D1E2C] dark:text-white mb-4">
                  Submission Status Distribution
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                      <span className="text-sm text-[#59656F] dark:text-[#DDBDD5]">
                        Passed
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-[#1D1E2C] dark:text-white">
                        {stats.statusDistribution.passed}
                      </span>
                      <div className="text-xs text-[#59656F] dark:text-[#DDBDD5]">
                        {(
                          (stats.statusDistribution.passed /
                            stats.totalSubmissions) *
                          100
                        ).toFixed(1)}
                        %
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-red-500 rounded mr-3"></div>
                      <span className="text-sm text-[#59656F] dark:text-[#DDBDD5]">
                        Failed
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-[#1D1E2C] dark:text-white">
                        {stats.statusDistribution.failed}
                      </span>
                      <div className="text-xs text-[#59656F] dark:text-[#DDBDD5]">
                        {(
                          (stats.statusDistribution.failed /
                            stats.totalSubmissions) *
                          100
                        ).toFixed(1)}
                        %
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-yellow-500 rounded mr-3"></div>
                      <span className="text-sm text-[#59656F] dark:text-[#DDBDD5]">
                        Partial
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-[#1D1E2C] dark:text-white">
                        {stats.statusDistribution.partial}
                      </span>
                      <div className="text-xs text-[#59656F] dark:text-[#DDBDD5]">
                        {(
                          (stats.statusDistribution.partial /
                            stats.totalSubmissions) *
                          100
                        ).toFixed(1)}
                        %
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-blue-500 rounded mr-3"></div>
                      <span className="text-sm text-[#59656F] dark:text-[#DDBDD5]">
                        Pending
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-[#1D1E2C] dark:text-white">
                        {stats.statusDistribution.pending}
                      </span>
                      <div className="text-xs text-[#59656F] dark:text-[#DDBDD5]">
                        {(
                          (stats.statusDistribution.pending /
                            stats.totalSubmissions) *
                          100
                        ).toFixed(1)}
                        %
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Overview */}
              <div className="bg-white dark:bg-[#2A2B3D] rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-[#1D1E2C] dark:text-white mb-6">
                  Performance Overview
                </h3>
                <div className="space-y-6">
                  {/* Success Rate */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-[#59656F] dark:text-[#DDBDD5]">
                        Overall Success Rate
                      </span>
                      <span className="text-sm font-bold text-[#1D1E2C] dark:text-white">
                        {stats.successRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${stats.successRate}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-[#59656F] dark:text-[#DDBDD5] mt-1">
                      {stats.statusDistribution.passed} out of{" "}
                      {stats.totalSubmissions} submissions passed
                    </div>
                  </div>

                  {/* Problem Completion */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-[#59656F] dark:text-[#DDBDD5]">
                        Problem Completion
                      </span>
                      <span className="text-sm font-bold text-[#1D1E2C] dark:text-white">
                        {stats.statusDistribution.passed}/
                        {stats.problemsAttempted}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                        style={{
                          width: `${Math.min(
                            (stats.statusDistribution.passed /
                              stats.problemsAttempted) *
                              100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <div className="text-xs text-[#59656F] dark:text-[#DDBDD5] mt-1">
                      {(
                        (stats.statusDistribution.passed /
                          stats.problemsAttempted) *
                        100
                      ).toFixed(1)}
                      % of attempted problems solved
                    </div>
                  </div>

                  {/* Average Attempts per Problem */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-[#59656F] dark:text-[#DDBDD5]">
                        Avg Attempts per Problem
                      </span>
                      <span className="text-sm font-bold text-[#1D1E2C] dark:text-white">
                        {(
                          stats.totalSubmissions /
                          Math.max(stats.problemsAttempted, 1)
                        ).toFixed(1)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-purple-400 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
                        style={{
                          width: `${Math.min(
                            (stats.totalSubmissions /
                              Math.max(stats.problemsAttempted, 1) /
                              5) *
                              100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <div className="text-xs text-[#59656F] dark:text-[#DDBDD5] mt-1">
                      Lower is better (optimal: 1-2 attempts)
                    </div>
                  </div>

                  {/* Performance Metrics Grid */}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="text-center p-3 bg-[#F7EBEC] dark:bg-[#1D1E2C] rounded-lg">
                      <div className="text-lg font-bold text-[#1D1E2C] dark:text-white">
                        {stats.averageExecutionTime.toFixed(0)}ms
                      </div>
                      <div className="text-xs text-[#59656F] dark:text-[#DDBDD5]">
                        Avg Runtime
                      </div>
                    </div>
                    <div className="text-center p-3 bg-[#F7EBEC] dark:bg-[#1D1E2C] rounded-lg">
                      <div className="text-lg font-bold text-[#1D1E2C] dark:text-white">
                        {Math.round(
                          ((stats.statusDistribution.passed +
                            stats.statusDistribution.partial) /
                            stats.totalSubmissions) *
                            100
                        )}
                        %
                      </div>
                      <div className="text-xs text-[#59656F] dark:text-[#DDBDD5]">
                        Pass + Partial
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Submissions */}
            <div className="bg-white dark:bg-[#2A2B3D] rounded-lg shadow">
              <div className="px-6 py-4 border-b border-[#DDBDD5]/30">
                <h3 className="text-lg font-semibold text-[#1D1E2C] dark:text-white">
                  Recent Submissions
                </h3>
              </div>
              <div className="divide-y divide-[#DDBDD5]/30">
                {stats.recentSubmissions.map((submission) => (
                  <div key={submission.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(submission.status)}>
                            {submission.status}
                          </Badge>
                          <span className="text-sm font-medium text-[#1D1E2C] dark:text-white">
                            Problem ID: {submission.problemId.slice(-8)}
                          </span>
                          <span className="text-xs text-[#59656F] dark:text-[#DDBDD5]">
                            {submission.executionTime || "N/A"}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-[#59656F] dark:text-[#DDBDD5]">
                          {formatDate(submission.submittedAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#2A2B3D] border-t border-[#DDBDD5]/30 px-4 py-4">
        <div className="container mx-auto flex items-center justify-center">
          <p className="text-sm text-[#59656F] dark:text-[#DDBDD5]">
            © 2025 Compilo by ComπBs.
          </p>
        </div>
      </footer>
    </div>
  );
}
