"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { Search, Filter, ArrowUpDown } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { apiClient } from "@/lib/api"

interface Problem {
  id: string // MongoDB ObjectID
  displayId: number // Sequential number for display
  title: string
  difficulty: "Easy" | "Medium" | "Hard"
  tags: string[]
  solvedCount: number
  acceptanceRate: string
}

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("id")

  // Fetch problems from API
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const data = await apiClient.getProblems()
        
        if (data.success && data.problems) {
          // Transform backend data to match frontend interface
          const transformedProblems: Problem[] = data.problems.map((problem: {
            id: string
            title: string
            difficulty: string
          }, index: number) => ({
            id: problem.id, // Keep MongoDB ObjectID for API calls
            displayId: index + 1, // Sequential number for display
            title: problem.title || "Untitled Problem",
            difficulty: (problem.difficulty as "Easy" | "Medium" | "Hard") || "Easy",
            tags: [], // Backend doesn't have tags yet, set empty array
            solvedCount: 0, // Backend doesn't have solved count yet
            acceptanceRate: "0%", // Backend doesn't have acceptance rate yet
          }))
          
          setProblems(transformedProblems)
        }
      } catch (error) {
        console.error('Failed to fetch problems:', error)
        // No fallback - let user see the error
        setProblems([])
      }
      
      setIsLoading(false)
    }

    fetchProblems()
  }, [])

  // Filter and sort problems
  const filteredProblems = problems
    .filter((problem) => {
      // Apply search filter
      if (searchQuery && !problem.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }

      // Apply difficulty filter
      if (difficultyFilter.length > 0 && !difficultyFilter.includes(problem.difficulty)) {
        return false
      }

      return true
    })
    .sort((a, b) => {
      // Apply sorting
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title)
        case "difficulty":
          const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 }
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
        case "acceptance":
          return Number.parseInt(a.acceptanceRate) - Number.parseInt(b.acceptanceRate)
        case "solved":
          return b.solvedCount - a.solvedCount
        default:
          return a.displayId - b.displayId
      }
    })

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

  const toggleDifficultyFilter = (difficulty: string) => {
    if (difficultyFilter.includes(difficulty)) {
      setDifficultyFilter(difficultyFilter.filter((d) => d !== difficulty))
    } else {
      setDifficultyFilter([...difficultyFilter, difficulty])
    }
  }

  return (
    <div className="min-h-screen bg-[#F7EBEC] dark:bg-[#1D1E2C] flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1D1E2C] dark:text-white mb-2">Problems</h1>
          <p className="text-[#59656F] dark:text-[#DDBDD5]">
            Choose a problem to solve and improve your coding skills! 🚀
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#59656F] dark:text-[#DDBDD5] h-4 w-4" />
            <Input
              placeholder="Search problems..."
              className="pl-10 border-[#DDBDD5]/50 focus:border-[#AC9FBB]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-[#DDBDD5]/50">
                  <Filter className="h-4 w-4 mr-2" />
                  Difficulty
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuCheckboxItem
                  checked={difficultyFilter.includes("Easy")}
                  onCheckedChange={() => toggleDifficultyFilter("Easy")}
                >
                  <span className="flex items-center">
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 mr-2">
                      Easy
                    </Badge>
                  </span>
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={difficultyFilter.includes("Medium")}
                  onCheckedChange={() => toggleDifficultyFilter("Medium")}
                >
                  <span className="flex items-center">
                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 mr-2">
                      Medium
                    </Badge>
                  </span>
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={difficultyFilter.includes("Hard")}
                  onCheckedChange={() => toggleDifficultyFilter("Hard")}
                >
                  <span className="flex items-center">
                    <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 mr-2">Hard</Badge>
                  </span>
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] border-[#DDBDD5]/50">
                <div className="flex items-center">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="id">Problem Number</SelectItem>
                <SelectItem value="title">Problem Title</SelectItem>
                <SelectItem value="difficulty">Difficulty</SelectItem>
                <SelectItem value="acceptance">Acceptance Rate</SelectItem>
                <SelectItem value="solved">Most Solved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Problems Table */}
        <div className="bg-white dark:bg-[#2A2B3D] rounded-lg shadow overflow-hidden">
          <div className="min-w-full divide-y divide-[#DDBDD5]/30">
            <div className="bg-[#DDBDD5]/20 dark:bg-[#59656F]/20">
              <div className="grid grid-cols-12 px-6 py-3 text-left text-xs font-medium text-[#59656F] dark:text-[#DDBDD5] uppercase tracking-wider">
                <div className="col-span-1">#</div>
                <div className="col-span-5">Title</div>
                <div className="col-span-2">Difficulty</div>
                <div className="col-span-2">Acceptance</div>
                <div className="col-span-2">Solved By</div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#2A2B3D] divide-y divide-[#DDBDD5]/30">
              {isLoading ? (
                <div className="px-6 py-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#AC9FBB] mx-auto mb-4"></div>
                  <p className="text-[#59656F] dark:text-[#DDBDD5]">Loading problems...</p>
                </div>
              ) : filteredProblems.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <p className="text-[#59656F] dark:text-[#DDBDD5]">No problems found matching your filters.</p>
                </div>
              ) : (
                filteredProblems.map((problem) => (
                  <Link key={problem.id} href={`/problems/${problem.id}`}>
                    <div className="grid grid-cols-12 px-6 py-4 hover:bg-[#F7EBEC] dark:hover:bg-[#1D1E2C] cursor-pointer transition-colors">
                      <div className="col-span-1 font-medium text-[#1D1E2C] dark:text-white">{problem.displayId}</div>
                      <div className="col-span-5">
                        <div className="font-medium text-[#1D1E2C] dark:text-white">{problem.title}</div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {problem.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#DDBDD5]/30 text-[#59656F] dark:bg-[#59656F]/30 dark:text-[#DDBDD5]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <Badge className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</Badge>
                      </div>
                      <div className="col-span-2 text-[#59656F] dark:text-[#DDBDD5]">{problem.acceptanceRate}</div>
                      <div className="col-span-2 text-[#59656F] dark:text-[#DDBDD5]">
                        {problem.solvedCount.toLocaleString()}
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#2A2B3D] border-t border-[#DDBDD5]/30 px-4 py-4 mt-auto">
        <div className="container mx-auto flex items-center justify-between">
          <p className="text-sm text-[#59656F] dark:text-[#DDBDD5]">
          © 2025 Compilo by ComπBs.
          </p>
          <div className="text-sm text-[#59656F] dark:text-[#DDBDD5]">{filteredProblems.length} problems available</div>
        </div>
      </footer>
    </div>
  )
}
