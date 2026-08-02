import { exportSessionSnapshot, importSessionSnapshot, purgeSessionOverlay } from '../services/overlayService.js';

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
