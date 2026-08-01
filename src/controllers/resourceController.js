import * as overlayService from '../services/overlayService.js';
import { AppError } from '../middleware/errorHandler.js';
import { sanitizePayload } from '../utils/sanitize.js';

export const makeResourceController = (resource) => {
  return {
    list: async (req, res, next) => {
      try {
        const { page, limit, _sort, _order, _delay, _status, q, ...queryFilters } = req.query;
        const rawFilters = { ...queryFilters, ...(req.resourceFilters || {}) };

        // Type-cast known relational and boolean filter fields
        const filters = {};
        for (const [key, value] of Object.entries(rawFilters)) {
          if (value === undefined || value === null || value === '') continue;

          if (key.endsWith('_id') || key === 'id' || key === 'user_id' || key === 'post_id') {
            const parsedInt = parseInt(value, 10);
            filters[key] = isNaN(parsedInt) ? value : parsedInt;
          } else if (key === 'completed') {
            filters[key] = value === 'true' || value === true;
          } else {
            filters[key] = value;
          }
        }

        const result = await overlayService.getPaginatedResource(
          req.identityId,
          resource,
          { page, limit, filters, _sort, _order, q }
        );
        res.json(result);
      } catch (error) {
        next(error);
      }
    },

    getOne: async (req, res, next) => {
      try {
        const record = await overlayService.getSingleResource(
          req.identityId,
          resource,
          req.params.id
        );
        if (!record) {
          throw new AppError(`${resource.slice(0, -1)} not found`, 404);
        }
        res.json(record);
      } catch (error) {
        next(error);
      }
    },

    create: async (req, res, next) => {
      try {
        const payload = sanitizePayload(req.body);
        const record = await overlayService.createOverlayRecord(
          req.identityId,
          resource,
          payload
        );
        res.status(201).json(record);
      } catch (error) {
        next(error);
      }
    },

    update: async (req, res, next) => {
      try {
        const payload = sanitizePayload(req.body);
        const record = await overlayService.updateOverlayRecord(
          req.identityId,
          resource,
          req.params.id,
          payload
        );
        res.json(record);
      } catch (error) {
        next(error);
      }
    },

    remove: async (req, res, next) => {
      try {
        await overlayService.deleteOverlayRecord(
          req.identityId,
          resource,
          req.params.id
        );
        res.status(204).send();
      } catch (error) {
        next(error);
      }
    }
  };
};
