import React from 'react'

export function LogoIcon({ className = "w-9 h-9", showContainer = true }) {
  const svg = (
    <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-sm">
      <defs>
        <linearGradient id="logoLeafGrad" x1="16" y1="12" x2="48" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a3e635" />
          <stop offset="45%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
        <linearGradient id="logoBracketGrad" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>

      {/* Left Bracket { */}
      <path
        d="M19 14 C13 14 11 19 11 25 C11 29 8 32 5 32 C8 32 11 35 11 39 C11 45 13 50 19 50"
        stroke="url(#logoBracketGrad)"
        strokeWidth="3.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Right Bracket } */}
      <path
        d="M45 14 C51 14 53 19 53 25 C53 29 56 32 59 32 C56 32 53 35 53 39 C53 45 51 50 45 50"
        stroke="url(#logoBracketGrad)"
        strokeWidth="3.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Circuit Nodes on Bracket Outer Apex */}
      <circle cx="5" cy="32" r="2.5" fill="#a3e635" />
      <circle cx="59" cy="32" r="2.5" fill="#a3e635" />

      {/* Central Green Leaf */}
      <path
        d="M32 12 C21 19 19 36 32 48 C45 36 43 19 32 12 Z"
        fill="url(#logoLeafGrad)"
      />

      {/* Central Stem & Microcircuit Traces */}
      <path d="M32 47 L32 20" stroke="#042f1a" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M32 35 L26 29 L23 29" stroke="#042f1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="22" cy="29" r="2" fill="#bef264" />
      <path d="M32 28 L38 23 L41 23" stroke="#042f1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="42" cy="23" r="2" fill="#bef264" />

      {/* Glowing Energy Node */}
      <circle cx="32" cy="14" r="2" fill="#ffffff" />
    </svg>
  )

  if (!showContainer) {
    return <div className={className}>{svg}</div>
  }

  return (
    <div className={`${className} bg-slate-900 border border-emerald-500/30 rounded-xl p-1.5 flex items-center justify-center shadow-md shadow-emerald-500/10 group-hover:scale-105 group-hover:border-emerald-400 transition-all duration-200`}>
      {svg}
    </div>
  )
}

export default function Logo({ size = "md", showWordmark = true, className = "" }) {
  const sizeClasses = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  }

  const iconSize = sizeClasses[size] || sizeClasses.md

  return (
    <div className={`flex items-center gap-2.5 group select-none ${className}`}>
      <LogoIcon className={iconSize} />

      {showWordmark && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center text-lg md:text-xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-emerald-500 via-green-500 to-lime-500 bg-clip-text text-transparent">
              EcoCode
            </span>
            <span className="text-slate-900 dark:text-white ml-1.5 font-black">
              Challenge
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 -mt-0.5">
            Green Dev Platform
          </span>
        </div>
      )}
    </div>
  )
}
