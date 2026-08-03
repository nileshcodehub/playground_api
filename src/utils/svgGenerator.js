import crypto from 'crypto';

// In-memory LRU cache to prevent re-generating SVGs for repeated seeds
const avatarCache = new Map();
const thumbnailCache = new Map();
const MAX_CACHE_SIZE = 1000;

// 12 Curated Modern Gradient Palettes
const PALETTES = [
  { name: 'Emerald Teal', start: '#059669', end: '#0d9488', text: '#ffffff' },
  { name: 'Indigo Purple', start: '#4f46e5', end: '#7c3aed', text: '#ffffff' },
  { name: 'Amber Orange', start: '#d97706', end: '#ea580c', text: '#ffffff' },
  { name: 'Cyan Blue', start: '#0284c7', end: '#2563eb', text: '#ffffff' },
  { name: 'Rose Pink', start: '#e11d48', end: '#db2777', text: '#ffffff' },
  { name: 'Violet Fuchsia', start: '#7c3aed', end: '#c026d3', text: '#ffffff' },
  { name: 'Sky Cyan', start: '#0ea5e9', end: '#06b6d4', text: '#ffffff' },
  { name: 'Lime Green', start: '#65a30d', end: '#16a34a', text: '#ffffff' },
  { name: 'Fuchsia Rose', start: '#d946ef', end: '#f43f5e', text: '#ffffff' },
  { name: 'Dark Slate', start: '#1e293b', end: '#334155', text: '#38bdf8' },
  { name: 'Obsidian Emerald', start: '#0f172a', end: '#064e3b', text: '#34d399' },
  { name: 'Sunset Amber', start: '#9a3412', end: '#c2410c', text: '#ffffff' }
];

/**
 * Hash a seed string into an integer index
 */
const hashSeed = (seed) => {
  const cleanSeed = String(seed || 'default').trim().toLowerCase();
  let hash = 0;
  for (let i = 0; i < cleanSeed.length; i++) {
    hash = (hash << 5) - hash + cleanSeed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

/**
 * Extract 1-2 uppercase initials from a seed string
 */
const extractInitials = (seed) => {
  let clean = String(seed || 'U')
    .replace(/\.svg|\.png/gi, '')
    .replace(/[^a-zA-Z0-9\s_-]/g, '')
    .trim();

  if (!clean) return 'PA';

  // Handle name strings like "Leanne Graham" or "user-leanne-graham"
  const parts = clean.split(/[\s_.-]+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  if (clean.length >= 2) {
    return clean.slice(0, 2).toUpperCase();
  }
  return clean.slice(0, 1).toUpperCase();
};

/**
 * Generate Dynamic SVG Avatar
 */
export const generateAvatarSvg = (rawSeed, options = {}) => {
  const seed = String(rawSeed || 'user').replace(/\.svg|\.png$/i, '');
  const size = Math.min(512, Math.max(32, parseInt(options.size || '128', 10)));
  const rounded = options.rounded !== 'false';
  const cacheKey = `${seed}_${size}_${rounded}`;

  if (avatarCache.has(cacheKey)) {
    return avatarCache.get(cacheKey);
  }

  const hash = hashSeed(seed);
  const palette = PALETTES[hash % PALETTES.length];
  const initials = extractInitials(seed);
  const rx = rounded ? size / 2 : Math.round(size * 0.15);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <defs>
    <linearGradient id="grad-${hash}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${palette.start}" />
      <stop offset="100%" stop-color="${palette.end}" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${rx}" fill="url(#grad-${hash})" />
  <text x="50%" y="54%" font-family="Inter, -apple-system, sans-serif" font-size="${Math.round(size * 0.42)}" font-weight="700" fill="${palette.text}" text-anchor="middle" dominant-baseline="middle" letter-spacing="1">${initials}</text>
</svg>`;

  if (avatarCache.size >= MAX_CACHE_SIZE) {
    const firstKey = avatarCache.keys().next().value;
    avatarCache.delete(firstKey);
  }
  avatarCache.set(cacheKey, svg);

  return svg;
};

/**
 * Generate Dynamic SVG Thumbnail Placeholder
 */
export const generateThumbnailSvg = (rawSeed, options = {}) => {
  const seed = String(rawSeed || 'post').replace(/\.svg|\.png$/i, '');
  const width = Math.min(1920, Math.max(100, parseInt(options.width || '600', 10)));
  const height = Math.min(1080, Math.max(100, parseInt(options.height || '400', 10)));
  const customText = options.text ? String(options.text).trim() : null;
  const cacheKey = `${seed}_${width}_${height}_${customText || ''}`;

  if (thumbnailCache.has(cacheKey)) {
    return thumbnailCache.get(cacheKey);
  }

  const hash = hashSeed(seed);
  const palette = PALETTES[hash % PALETTES.length];

  // Format label text
  let labelText = customText;
  if (!labelText) {
    let clean = seed.replace(/[-_]+/g, ' ').trim();
    if (/^post\s*\d+$/i.test(clean)) {
      labelText = clean.replace(/post\s*(\d+)/i, 'Post #$1');
    } else {
      labelText = clean.charAt(0).toUpperCase() + clean.slice(1);
    }
  }

  const fontSize = Math.max(14, Math.round(width * 0.055));

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <linearGradient id="thumb-grad-${hash}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${palette.start}" />
      <stop offset="100%" stop-color="${palette.end}" />
    </linearGradient>
    <pattern id="grid-${hash}" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="1" />
    </pattern>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#thumb-grad-${hash})" />
  <rect width="${width}" height="${height}" fill="url(#grid-${hash})" />
  <text x="50%" y="46%" font-family="Inter, -apple-system, sans-serif" font-size="${fontSize}" font-weight="700" fill="${palette.text}" text-anchor="middle" dominant-baseline="middle">${labelText}</text>
  <rect x="${width / 2 - 45}" y="${height / 2 + fontSize * 0.8}" width="90" height="22" rx="11" fill="rgba(0,0,0,0.25)" />
  <text x="50%" y="${height / 2 + fontSize * 0.8 + 11}" font-family="Inter, -apple-system, sans-serif" font-size="11" font-weight="600" fill="rgba(255,255,255,0.85)" text-anchor="middle" dominant-baseline="middle">${width} × ${height}</text>
</svg>`;

  if (thumbnailCache.size >= MAX_CACHE_SIZE) {
    const firstKey = thumbnailCache.keys().next().value;
    thumbnailCache.delete(firstKey);
  }
  thumbnailCache.set(cacheKey, svg);

  return svg;
};
