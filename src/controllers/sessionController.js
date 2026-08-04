import { exportSessionSnapshot, importSessionSnapshot, purgeSessionOverlay, getSessionStats } from '../services/overlayService.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * GET /session/export
 * Export session sandbox snapshot as downloadable JSON file
 */
export const exportSession = async (req, res, next) => {
  try {
    const resource = req.query.resource || 'all';
    const snapshot = await exportSessionSnapshot(req.identityId, resource);

    const filename = resource === 'all'
      ? 'playground_sandbox_snapshot.json'
      : `playground_${resource}_snapshot.json`;

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.status(200).json(snapshot);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /session/import
 * Restore/import session sandbox snapshot from JSON payload
 */
export const importSession = async (req, res, next) => {
  try {
    const payload = req.body;
    const options = {
      strategy: req.query.strategy || req.body.strategy || 'replace',
      targetResource: req.query.resource || req.body.targetResource || null
    };

    const result = await importSessionSnapshot(req.identityId, payload, options);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /session/reset
 * Purge session sandbox
 */
export const resetSession = async (req, res, next) => {
  try {
    const result = await purgeSessionOverlay(req.identityId);
    return res.status(200).json({
      message: 'Session sandbox overlay purged successfully.',
      purgedRecords: result.count
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /session/stats
 * Retrieve active session identity stats, quotas, and record breakdown
 */
export const getSessionStatsController = async (req, res, next) => {
  try {
    const identityId = req.identityId;
    if (!identityId) {
      throw new AppError('Identity required for session statistics', 401);
    }

    const stats = await getSessionStats(identityId);
    res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
};

