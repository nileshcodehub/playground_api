import { ImageResponse } from 'next/og';
import { themeColors } from '@/config/theme';

export const runtime = 'edge';

export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default function AppleIcon() {
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
          borderRadius: 36,
          border: `4px solid ${brand.primary}`,
          position: 'relative',
        }}
      >
        <svg
          width="112"
          height="112"
          viewBox="0 0 512 512"
          fill="none"
        >
          {/* Left Bracket < */}
          <path
            d="M 180 160 L 100 256 L 180 352"
            stroke={brand.accent}
            strokeWidth="42"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Right Bracket > */}
          <path
            d="M 332 160 L 412 256 L 332 352"
            stroke={brand.accent}
            strokeWidth="42"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Center Play Icon Triangle ▶ */}
          <path
            d="M 220 185 L 310 256 L 220 327 Z"
            fill={brand.accent}
            stroke={brand.primary}
            strokeWidth="16"
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
