import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Image metadata - Google requires a multiple of 48px square (48x48, 96x96, 192x192)
export const size = {
  width: 48,
  height: 48,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
          borderRadius: 12,
          border: '2px solid #10b981',
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
            stroke="#10b981"
            strokeWidth="48"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Right Bracket > */}
          <path
            d="M 332 160 L 412 256 L 332 352"
            stroke="#10b981"
            strokeWidth="48"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Center Play Icon Triangle ▶ */}
          <path
            d="M 220 185 L 310 256 L 220 327 Z"
            fill="#38bdf8"
            stroke="#10b981"
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
