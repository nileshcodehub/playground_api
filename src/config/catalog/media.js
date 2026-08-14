export const getMediaEndpoints = () => {
  return [
    {
      method: 'GET',
      path: '/public/avatars/:seed.svg',
      title: 'Generate Dynamic SVG Avatar',
      description: 'Generates a crisp, colorful vector SVG avatar based on a seed string (username, email, or ID) with deterministic gradient background and initials.',
      params: [
        { name: 'seed', type: 'String (Required)', desc: 'Seed string used for deterministic color hashing and initials extraction (e.g. bret, alice, user-1).' },
        { name: 'size', type: 'Integer (Query)', desc: 'Avatar width & height in pixels (default: 128).' },
        { name: 'rounded', type: 'Boolean (Query)', desc: 'Whether to render circular or rounded squircle border (default: true).' }
      ],
      responseExample: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <linearGradient id="grad-12345" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#059669" />
      <stop offset="100%" stop-color="#0d9488" />
    </linearGradient>
  </defs>
  <rect width="128" height="128" rx="64" fill="url(#grad-12345)" />
  <text x="50%" y="54%" font-family="Inter, sans-serif" font-size="54" font-weight="700" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">BR</text>
</svg>`
    },
    {
      method: 'GET',
      path: '/public/thumbnails/:seed.svg',
      title: 'Generate Dynamic SVG Landscape Thumbnail',
      description: 'Generates a 600x400 landscape vector SVG placeholder image with mesh gradient background, custom or auto-formatted title text, and dimension badge.',
      params: [
        { name: 'seed', type: 'String (Required)', desc: 'Seed string used for background color hashing and title formatting (e.g. post-1, react-tutorial).' },
        { name: 'width', type: 'Integer (Query)', desc: 'Thumbnail width in pixels (default: 600).' },
        { name: 'height', type: 'Integer (Query)', desc: 'Thumbnail height in pixels (default: 400).' },
        { name: 'text', type: 'String (Query)', desc: 'Custom title label text with multiline word-wrapping instead of formatted seed.' },
        { name: 'description', type: 'String (Query)', desc: 'Optional subtitle/description text rendered beneath title with auto word-wrapping.' }
      ],
      responseExample: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
  <defs>
    <linearGradient id="thumb-grad-54321" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4f46e5" />
      <stop offset="100%" stop-color="#7c3aed" />
    </linearGradient>
  </defs>
  <rect width="600" height="400" fill="url(#thumb-grad-54321)" />
  <text x="50%" y="46%" font-family="Inter, sans-serif" font-size="33" font-weight="700" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">Post #1</text>
</svg>`
    }
  ];
};
