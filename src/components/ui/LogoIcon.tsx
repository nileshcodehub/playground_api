import React from 'react';

interface LogoIconProps {
  className?: string;
  size?: number;
}

export function LogoIcon({ className = 'w-8 h-8', size = 32 }: LogoIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={size}
      height={size}
      className={className}
    >
      <defs>
        <linearGradient id="bgGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="50%" stopColor="#1e1b4b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="primaryGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="50%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="accentGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
        <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="12" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <rect width="512" height="512" rx="112" fill="url(#bgGlow)" stroke="url(#primaryGlow)" strokeWidth="12" />

      <g filter="url(#glowEffect)">
        {/* Left Bracket < */}
        <path
          d="M 180 160 L 100 256 L 180 352"
          fill="none"
          stroke="url(#primaryGlow)"
          strokeWidth="36"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Right Bracket > */}
        <path
          d="M 332 160 L 412 256 L 332 352"
          fill="none"
          stroke="url(#primaryGlow)"
          strokeWidth="36"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Center Play Icon Triangle ▶ */}
        <path
          d="M 220 185 L 310 256 L 220 327 Z"
          fill="url(#accentGlow)"
          stroke="url(#primaryGlow)"
          strokeWidth="12"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
