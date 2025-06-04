"use client"

import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { LogOut, Moon, Sun } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface NavbarProps {
  variant?: "default" | "landing"
}

export function Navbar({ variant = "default" }: NavbarProps) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    localStorage.clear()
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
          <div className="flex items-center gap-4">
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
        </nav>
      </header>
    )
  }

  return (
    <header className="bg-white dark:bg-[#2A2B3D] border-b border-[#DDBDD5]/30 px-4 py-3">
      <div className="flex items-center justify-between">
        <Link href="/">
          <Logo size="sm" />
        </Link>
        <div className="flex items-center gap-2">
          {mounted && (
            <Button variant="ghost" size="sm" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}