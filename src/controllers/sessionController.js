import { resetSessionOverlay, getSessionStats } from '../services/overlayService.js';
import { AppError } from '../middleware/errorHandler.js';

export const resetSession = async (req, res, next) => {
  try {
    const identityId = req.identityId;
    if (!identityId) {
      throw new AppError('Identity required for session reset', 401);
    }

    const { count } = await resetSessionOverlay(identityId);

    res.status(200).json({
      message: 'Session sandbox reset successfully',
      purgedRecords: count
    });
  } catch (error) {
    next(error);
  }
};

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
