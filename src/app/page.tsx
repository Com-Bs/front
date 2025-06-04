import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Logo } from "@/components/logo"
import { Code, Zap, Users } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-[#F7EBEC] via-white to-[#DDBDD5] dark:from-[#1D1E2C] dark:via-[#2A2B3D] dark:to-[#59656F]">
      <Navbar variant="landing" />

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-[#AC9FBB] via-[#59656F] to-[#1D1E2C] bg-clip-text text-transparent">
            Code. Compile. Conquer.
          </h1>
          <p className="text-xl text-[#59656F] dark:text-[#DDBDD5] mb-8 leading-relaxed">
            Start your programming journey with Compilo, the ultimate platform for learning how to code. 
            Whether you&apos;re a complete beginner or looking to sharpen your skills, we provide the tools and resources you need to succeed.
            
          </p>
          <div className="flex gap-4 justify-center mb-16">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#AC9FBB] to-[#59656F] hover:from-[#DDBDD5] hover:to-[#AC9FBB] text-white px-8 py-3 text-lg"
              >
                Start Coding 
              </Button>
            </Link>
          </div>

          {/* Feature Cards */}
          <div id="features" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-20">
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
            © 2025 Compilo by ComπBs
          </p>
        </div>
      </footer>
    </div>
  )
}
