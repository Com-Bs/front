"use client"

import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { LogOut, Moon, Sun, Menu, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"

interface NavbarProps {
  variant?: "default" | "landing"
}

export function Navbar({ variant = "default" }: NavbarProps) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { logout } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  if (variant === "landing") {
    return (
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Logo size="lg" />
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            {mounted && (
              <Button variant="ghost" size="sm" onClick={toggleTheme}>
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            )}
            <Link href="/auth/login">
              <Button variant="ghost" className="text-[#59656F] dark:text-[#DDBDD5]">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-gradient-to-r from-[#AC9FBB] to-[#59656F] hover:from-[#DDBDD5] hover:to-[#AC9FBB] text-white">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-[#DDBDD5]/30 pt-4">
            <div className="flex flex-col gap-3">
              {mounted && (
                <Button variant="ghost" size="sm" onClick={toggleTheme} className="justify-start">
                  {theme === "dark" ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </Button>
              )}
              <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className="text-[#59656F] dark:text-[#DDBDD5] w-full justify-start">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="bg-gradient-to-r from-[#AC9FBB] to-[#59656F] hover:from-[#DDBDD5] hover:to-[#AC9FBB] text-white w-full">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>
    )
  }

  return (
    <header className="bg-white dark:bg-[#2A2B3D] border-b border-[#DDBDD5]/30 px-4 py-3">
      <div className="flex items-center justify-between">
        <Link href="/">
          <Logo size="sm" />
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-2">
          {mounted && (
            <Button variant="ghost" size="sm" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-[#DDBDD5]/30 pt-4">
          <div className="flex flex-col gap-3">
            {mounted && (
              <Button variant="ghost" size="sm" onClick={toggleTheme} className="justify-start">
                {theme === "dark" ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={handleLogout} className="justify-start text-red-600 dark:text-red-400">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}