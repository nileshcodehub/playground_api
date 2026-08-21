import React from 'react';
import { themeColors } from '@/config/theme';

interface LogoIconProps {
  className?: string;
  size?: number;
}

export function LogoIcon({ className = 'w-8 h-8', size = 32 }: LogoIconProps) {
  const idPrefix = React.useId().replace(/:/g, '');
  const { brand, dark } = themeColors;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={size}
      height={size}
      className={className}
      aria-label="Playground API Logo"
    >
      <defs>
        {/* Background Dark Obsidian/Slate Glow Gradient */}
        <linearGradient id={`${idPrefix}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={dark.bgObsidian} />
          <stop offset="50%" stopColor={brand.deepDark} />
          <stop offset="100%" stopColor={dark.bgObsidianGlow} />
        </linearGradient>

        {/* Primary Emerald/Teal Brand Gradient */}
        <linearGradient id={`${idPrefix}-brand`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={brand.accent} />
          <stop offset="50%" stopColor={brand.primary} />
          <stop offset="100%" stopColor={brand.cyan} />
        </linearGradient>

        {/* Play Button Bright Accent Gradient */}
        <linearGradient id={`${idPrefix}-play`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={brand.light} />
          <stop offset="50%" stopColor={brand.primary} />
          <stop offset="100%" stopColor={brand.sky} />
        </linearGradient>

        {/* Outer Glow Effect Filter */}
        <filter id={`${idPrefix}-glow`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Rounded Container Box with Emerald Stroke */}
      <rect
        width="512"
        height="512"
        rx="112"
        fill={`url(#${idPrefix}-bg)`}
        stroke={`url(#${idPrefix}-brand)`}
        strokeWidth="12"
      />

      {/* Glowing Inner Content */}
      <g filter={`url(#${idPrefix}-glow)`}>
        {/* Left Bracket < */}
        <path
          d="M 180 160 L 100 256 L 180 352"
          fill="none"
          stroke={`url(#${idPrefix}-brand)`}
          strokeWidth="38"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Right Bracket > */}
        <path
          d="M 332 160 L 412 256 L 332 352"
          fill="none"
          stroke={`url(#${idPrefix}-brand)`}
          strokeWidth="38"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Center Play Triangle ▶ */}
        <path
          d="M 220 185 L 314 256 L 220 327 Z"
          fill={`url(#${idPrefix}-play)`}
          stroke={`url(#${idPrefix}-brand)`}
          strokeWidth="12"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

