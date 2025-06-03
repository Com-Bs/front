interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function Logo({ className = "", size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${sizeClasses[size]} relative`}>
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* C-shaped symbol with modern twist */}
          <path
            d="M20 4C11.163 4 4 11.163 4 20C4 28.837 11.163 36 20 36C24.418 36 28.418 34.209 31.314 31.314"
            stroke="url(#gradient)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M28 12L32 16L28 20"
            stroke="url(#gradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#AC9FBB" />
              <stop offset="50%" stopColor="#DDBDD5" />
              <stop offset="100%" stopColor="#59656F" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <span className="font-bold text-xl bg-gradient-to-r from-[#AC9FBB] to-[#59656F] bg-clip-text text-transparent">
        Compilo
      </span>
    </div>
  )
}
