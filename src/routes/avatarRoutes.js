import { Router } from 'express';
import { generateAvatarSvg, generateThumbnailSvg } from '../utils/svgGenerator.js';

const router = Router();

/**
 * GET /public/avatars/:seed
 * GET /public/avatars/:seed.svg
 */
router.get('/avatars/:seed', (req, res) => {
  const { seed } = req.params;
  const svg = generateAvatarSvg(seed, req.query);

  res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=31536000, stale-while-revalidate');
  res.send(svg);
});

/**
 * GET /public/thumbnails/:seed
 * GET /public/thumbnails/:seed.svg
 */
router.get('/thumbnails/:seed', (req, res) => {
  const { seed } = req.params;
  const svg = generateThumbnailSvg(seed, req.query);

  res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=31536000, stale-while-revalidate');
  res.send(svg);
});

export default router;
