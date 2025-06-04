"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Logo } from "@/components/logo"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Mock authentication
    if (email === "hello" && password === "hello123") {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      router.push("/app")
    } else {
      alert("Invalid credentials! Use hello / hello123")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7EBEC] via-white to-[#DDBDD5] dark:from-[#1D1E2C] dark:via-[#2A2B3D] dark:to-[#59656F] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo size="lg" className="justify-center mb-4" />
          <h1 className="text-2xl font-bold text-[#1D1E2C] dark:text-white">Welcome back!</h1>
          <p className="text-[#59656F] dark:text-[#DDBDD5] mt-2">Enter your credentials to access your account</p>
        </div>

        <Card className="bg-white/80 dark:bg-[#2A2B3D]/80 backdrop-blur-sm border-[#DDBDD5]/30">
      
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#1D1E2C] dark:text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                    placeholder="PasswordExample123"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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


              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#AC9FBB] to-[#59656F] hover:from-[#DDBDD5] hover:to-[#AC9FBB] text-white"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-[#59656F] dark:text-[#DDBDD5]">
                {"Don't have an account? "}
                <Link href="/auth/signup" className="text-[#AC9FBB] hover:text-[#59656F] hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
