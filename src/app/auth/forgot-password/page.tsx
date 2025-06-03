"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Logo } from "@/components/logo"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitted(true)
    setIsLoading(false)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F7EBEC] via-white to-[#DDBDD5] dark:from-[#1D1E2C] dark:via-[#2A2B3D] dark:to-[#59656F] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Logo size="lg" className="justify-center mb-4" />
            <h1 className="text-2xl font-bold text-[#1D1E2C] dark:text-white">Check your email! 📧</h1>
          </div>

          <Card className="bg-white/80 dark:bg-[#2A2B3D]/80 backdrop-blur-sm border-[#DDBDD5]/30">
            <CardContent className="pt-6 text-center">
              <p className="text-[#59656F] dark:text-[#DDBDD5] mb-6">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="text-sm text-[#59656F] dark:text-[#DDBDD5] mb-6">
                {"Didn't receive the email? Check your spam folder or try again."}
              </p>
              <Link href="/auth/login">
                <Button className="w-full bg-gradient-to-r from-[#AC9FBB] to-[#59656F] hover:from-[#DDBDD5] hover:to-[#AC9FBB] text-white">
                  Back to Sign In
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7EBEC] via-white to-[#DDBDD5] dark:from-[#1D1E2C] dark:via-[#2A2B3D] dark:to-[#59656F] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo size="lg" className="justify-center mb-4" />
          <h1 className="text-2xl font-bold text-[#1D1E2C] dark:text-white">Forgot Password? 🤔</h1>
          <p className="text-[#59656F] dark:text-[#DDBDD5] mt-2">No worries, we'll help you reset it!</p>
        </div>

        <Card className="bg-white/80 dark:bg-[#2A2B3D]/80 backdrop-blur-sm border-[#DDBDD5]/30">
          <CardHeader>
            <CardTitle className="text-[#1D1E2C] dark:text-white">Reset Password</CardTitle>
            <CardDescription className="text-[#59656F] dark:text-[#DDBDD5]">
              Enter your email address and we'll send you a reset link
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#1D1E2C] dark:text-white">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-[#DDBDD5]/50 focus:border-[#AC9FBB]"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#AC9FBB] to-[#59656F] hover:from-[#DDBDD5] hover:to-[#AC9FBB] text-white"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/auth/login"
                className="inline-flex items-center text-sm text-[#AC9FBB] hover:text-[#59656F] hover:underline"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
