import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { Code, Zap, Trophy, Users } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7EBEC] via-white to-[#DDBDD5] dark:from-[#1D1E2C] dark:via-[#2A2B3D] dark:to-[#59656F]">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Logo size="lg" />
          <div className="flex items-center gap-4">
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

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-[#AC9FBB] via-[#59656F] to-[#1D1E2C] bg-clip-text text-transparent">
            Code. Compile. Conquer.
          </h1>
          <p className="text-xl text-[#59656F] dark:text-[#DDBDD5] mb-8 leading-relaxed">
            Master coding interviews with our playful, beginner-friendly platform. Practice problems, run tests, and
            level up your programming skills! 🚀
          </p>
          <div className="flex gap-4 justify-center mb-16">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#AC9FBB] to-[#59656F] hover:from-[#DDBDD5] hover:to-[#AC9FBB] text-white px-8 py-3 text-lg"
              >
                Start Coding Now
              </Button>
            </Link>
            <Link href="#features">
              <Button
                size="lg"
                variant="outline"
                className="border-[#AC9FBB] text-[#59656F] hover:bg-[#F7EBEC] px-8 py-3 text-lg"
              >
                Learn More
              </Button>
            </Link>
          </div>

          {/* Feature Cards */}
          <div id="features" className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
            <div className="bg-white/50 dark:bg-[#2A2B3D]/50 backdrop-blur-sm rounded-xl p-6 border border-[#DDBDD5]/30">
              <Code className="w-12 h-12 text-[#AC9FBB] mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-[#1D1E2C] dark:text-white mb-2">Interactive Editor</h3>
              <p className="text-[#59656F] dark:text-[#DDBDD5] text-sm">
                Code in your browser with syntax highlighting and real-time feedback
              </p>
            </div>

            <div className="bg-white/50 dark:bg-[#2A2B3D]/50 backdrop-blur-sm rounded-xl p-6 border border-[#DDBDD5]/30">
              <Zap className="w-12 h-12 text-[#AC9FBB] mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-[#1D1E2C] dark:text-white mb-2">Instant Testing</h3>
              <p className="text-[#59656F] dark:text-[#DDBDD5] text-sm">
                Run your code against test cases and see results immediately
              </p>
            </div>

            <div className="bg-white/50 dark:bg-[#2A2B3D]/50 backdrop-blur-sm rounded-xl p-6 border border-[#DDBDD5]/30">
              <Trophy className="w-12 h-12 text-[#AC9FBB] mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-[#1D1E2C] dark:text-white mb-2">Progress Tracking</h3>
              <p className="text-[#59656F] dark:text-[#DDBDD5] text-sm">
                Track your progress and celebrate your coding achievements
              </p>
            </div>

            <div className="bg-white/50 dark:bg-[#2A2B3D]/50 backdrop-blur-sm rounded-xl p-6 border border-[#DDBDD5]/30">
              <Users className="w-12 h-12 text-[#AC9FBB] mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-[#1D1E2C] dark:text-white mb-2">Beginner Friendly</h3>
              <p className="text-[#59656F] dark:text-[#DDBDD5] text-sm">
                Designed for new coders with helpful hints and explanations
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20 border-t border-[#DDBDD5]/30">
        <div className="flex items-center justify-between">
          <Logo />
          <p className="text-[#59656F] dark:text-[#DDBDD5] text-sm">
            © 2024 Compilo. Made with 💜 for aspiring developers.
          </p>
        </div>
      </footer>
    </div>
  )
}
