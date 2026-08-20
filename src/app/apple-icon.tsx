import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default function AppleIcon() {
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
          borderRadius: 36,
          border: '4px solid #10b981',
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
            stroke="#10b981"
            strokeWidth="42"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Right Bracket > */}
          <path
            d="M 332 160 L 412 256 L 332 352"
            stroke="#10b981"
            strokeWidth="42"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Center Play Icon Triangle ▶ */}
          <path
            d="M 220 185 L 310 256 L 220 327 Z"
            fill="#38bdf8"
            stroke="#10b981"
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
