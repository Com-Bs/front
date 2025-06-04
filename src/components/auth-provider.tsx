'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { apiClient } from '@/lib/api'

interface User {
  id: number
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = () => {
      if (apiClient.isAuthenticated()) {
        // You might want to validate the token with the backend here
        // For now, we'll just check if a token exists
        setUser({
          id: 1,
          email: 'user@example.com', // This should come from the token or a user info endpoint
          name: 'User'
        })
      }
      setIsLoading(false)
    }

    checkAuth()

    // Listen for automatic logouts (401 responses)
    const handleLogout = () => {
      // Only clear user if we're not in the middle of a login attempt
      if (!isLoggingIn) {
        setUser(null)
      }
    }

    apiClient.addLogoutListener(handleLogout)

    return () => {
      apiClient.removeLogoutListener(handleLogout)
    }
  }, [isLoggingIn])

  const login = async (email: string, password: string) => {
    setIsLoggingIn(true)
    try {
      const response = await apiClient.login(email, password)
      
      if (response.success && response.user) {
        setUser(response.user)
      } else {
        throw new Error(response.message || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setIsLoggingIn(false)
    }
  }

  const logout = () => {
    apiClient.logout()
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}