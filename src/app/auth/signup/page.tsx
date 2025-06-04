"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Logo } from "@/components/logo"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!")
      setIsLoading(false)
      return
    }

    try {
      const response = await apiClient.signup(formData.name, formData.email, formData.password)
      
      if (response.success) {
        setSuccess("Account created successfully! Redirecting to login...")
        setTimeout(() => {
          router.push("/auth/login")
        }, 2000)
      } else {
        setError("Signup failed. Please try again.")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed")
    }

    setIsLoading(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7EBEC] via-white to-[#DDBDD5] dark:from-[#1D1E2C] dark:via-[#2A2B3D] dark:to-[#59656F] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo size="lg" className="justify-center mb-4" />
          <h1 className="text-2xl font-bold text-[#1D1E2C] dark:text-white">Join Compilo!</h1>
          <p className="text-[#59656F] dark:text-[#DDBDD5] mt-2">Fill in your details to get started to start your coding adventure</p>
        </div>

        <Card className="bg-white/80 dark:bg-[#2A2B3D]/80 backdrop-blur-sm border-[#DDBDD5]/30">
        
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                  {error}
                </div>
              )}
              {success && (
                <div className="p-3 text-sm text-green-500 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
                  {success}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#1D1E2C] dark:text-white">
                  Username
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Username"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="border-[#DDBDD5]/50 focus:border-[#AC9FBB]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#1D1E2C] dark:text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="border-[#DDBDD5]/50 focus:border-[#AC9FBB]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#1D1E2C] dark:text-white">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="border-[#DDBDD5]/50 focus:border-[#AC9FBB] pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-[#59656F]" />
                    ) : (
                      <Eye className="h-4 w-4 text-[#59656F]" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-[#1D1E2C] dark:text-white">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className="border-[#DDBDD5]/50 focus:border-[#AC9FBB]"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#AC9FBB] to-[#59656F] hover:from-[#DDBDD5] hover:to-[#AC9FBB] text-white"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-[#59656F] dark:text-[#DDBDD5]">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-[#AC9FBB] hover:text-[#59656F] hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
