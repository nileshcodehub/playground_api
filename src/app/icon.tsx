import { ImageResponse } from 'next/og';
import { themeColors } from '@/config/theme';

export const runtime = 'edge';

// Image metadata - Google requires a multiple of 48px square (48x48, 96x96, 192x192)
export const size = {
  width: 48,
  height: 48,
};
export const contentType = 'image/png';

export default function Icon() {
  const { brand, dark } = themeColors;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, ${dark.bgObsidian} 0%, ${brand.dark} 50%, ${brand.darkest} 100%)`,
          borderRadius: 12,
          border: `2px solid ${brand.primary}`,
          position: 'relative',
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 512 512"
          fill="none"
        >
          {/* Left Bracket < */}
          <path
            d="M 180 160 L 100 256 L 180 352"
            stroke={brand.accent}
            strokeWidth="48"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Right Bracket > */}
          <path
            d="M 332 160 L 412 256 L 332 352"
            stroke={brand.accent}
            strokeWidth="48"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Center Play Icon Triangle ▶ */}
          <path
            d="M 220 185 L 310 256 L 220 327 Z"
            fill={brand.accent}
            stroke={brand.primary}
            strokeWidth="18"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
