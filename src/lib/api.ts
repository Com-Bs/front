import type { CodeRunResult, ProblemResponse, UserSolutionsResponse } from './api-types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

// Event listener for logout
type LogoutListener = () => void
let logoutListeners: LogoutListener[] = []

class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
    this.token = this.getStoredToken()
  }

  private getStoredToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token')
    }
    return null
  }

  private setStoredToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
      this.token = token
    }
  }

  private removeStoredToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
      this.token = null
    }
  }

  private handleUnauthorized(isLoginAttempt: boolean = false): void {
    this.removeStoredToken()
    // Notify all listeners about logout
    logoutListeners.forEach(listener => listener())
    
    // Only redirect if this isn't a login attempt and we're on the client side
    if (!isLoginAttempt && typeof window !== 'undefined' && !window.location.pathname.includes('/auth/')) {
      window.location.href = '/auth/login'
    }
  }

  addLogoutListener(listener: LogoutListener): void {
    logoutListeners.push(listener)
  }

  removeLogoutListener(listener: LogoutListener): void {
    logoutListeners = logoutListeners.filter(l => l !== listener)
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    isLoginAttempt: boolean = false
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    const config: RequestInit = {
      ...options,
      headers,
    }

    const response = await fetch(url, config)
    
    // Handle unauthorized responses
    if (response.status === 401) {
      this.handleUnauthorized(isLoginAttempt)
      throw new Error('Unauthorized - please log in again')
    }
    
    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = `HTTP error! status: ${response.status}`
      
      try {
        const errorData = JSON.parse(errorText)
        errorMessage = errorData.message || errorMessage
      } catch {
        // If response is not JSON, use default message
      }
      
      throw new Error(errorMessage)
    }

    return response.json()
  }

  private capitalizeFirstLetter(str: string): "Easy" | "Medium" | "Hard" {
    const capitalized = str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
    if (capitalized === "Easy" || capitalized === "Medium" || capitalized === "Hard") {
      return capitalized
    }
    return "Easy" // fallback to Easy if the value doesn't match
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.request<{ 
      success: boolean
      token: string
      user: { id: number; email: string; name: string }
      message?: string
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }, true) // Mark this as a login attempt
    
    if (response.success && response.token) {
      this.setStoredToken(response.token)
    }
    
    return response
  }

  async signup(username: string, email: string, password: string) {
    return this.request<{ 
      success: boolean
      user: { username: string; email: string }
      message: string 
    }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    })
  }

  logout() {
    this.removeStoredToken()
    // Notify listeners about manual logout
    logoutListeners.forEach(listener => listener())
  }

  // Problem endpoints
  async getProblems() {
    const response = await this.request<{
      success: boolean
      problems: Array<{
        id: string
        title: string
        difficulty: string
        description: string
        hints: string[]
        test_cases: Array<{ input: string; output: string }>
        created_at: string
        updated_at: string
      }>
    }>('/problems', {
      method: 'GET',
    })

    if (response.success) {
      response.problems = response.problems.map(problem => ({
        ...problem,
        difficulty: this.capitalizeFirstLetter(problem.difficulty)
      }))
    }

    return response
  }

  async getProblem(id: string) {
    const response = await this.request<ProblemResponse>(`/problems/${id}`, {
      method: 'GET',
    })

    if (response.success) {
      response.problem.difficulty = this.capitalizeFirstLetter(response.problem.difficulty)
    }

    return response
  }

  // Code execution endpoint
  async runCode(code: string, problemId?: string) {
    return this.request<CodeRunResult>('/code/run', {
      method: 'POST',
      body: JSON.stringify({ code, problemId }),
    })
  }

  // Get user's previous solutions for a problem
  async getUserSolutions(problemId: string) {
    return this.request<UserSolutionsResponse>(`/problems/${problemId}/solutions`, {
      method: 'GET',
    })
  }

  isAuthenticated(): boolean {
    return this.token !== null
  }
}

export const apiClient = new ApiClient()
export default apiClient