/**
 * Centralized Theme & Brand Color Tokens
 * Single source of truth for brand colors, SVG vectors, Next.js ImageResponse icons, and inline styles.
 */
export const themeColors = {
  brand: {
    primary: '#10b981',      // Emerald 500 (Main brand accent)
    hover: '#059669',        // Emerald 600
    accent: '#34d399',       // Emerald 400 (Mint highlights & bracket strokes)
    light: '#6ee7b7',        // Emerald 300 (Play glow)
    dark: '#064e3b',         // Emerald 900
    deepDark: '#062d24',     // Obsidian Emerald backdrop
    darkest: '#022c22',      // Emerald 950
    teal: '#0d9488',         // Teal 600
    cyan: '#06b6d4',         // Cyan 500
    sky: '#38bdf8',          // Sky 400
  },
  dark: {
    bgPrimary: '#12141a',
    bgSecondary: '#181b24',
    bgTertiary: '#202430',
    bgObsidian: '#0f172a',
    bgObsidianGlow: '#091815',
    textPrimary: '#f8fafc',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
    border: 'rgba(255, 255, 255, 0.08)',
    borderHover: 'rgba(255, 255, 255, 0.16)',
    cardBg: '#181b24',
    codeBg: '#0f1219',
  },
  light: {
    bgPrimary: '#ffffff',
    bgSecondary: '#f8fafc',
    bgTertiary: '#f1f5f9',
    textPrimary: '#0f172a',
    textSecondary: '#334155',
    textMuted: '#64748b',
    border: '#e2e8f0',
    borderHover: '#cbd5e1',
    cardBg: '#ffffff',
    codeBg: '#f8fafc',
  },
  methods: {
    get: '#10b981',
    post: '#3b82f6',
    put: '#f59e0b',
    patch: '#8b5cf6',
    delete: '#ef4444',
  },
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
} as const;

export default themeColors;
