import {
  getCustomCollections,
  seedCustomTemplate,
  getPaginatedResource,
  getSingleResource,
  createOverlayRecord,
  updateOverlayRecord,
  deleteOverlayRecord
} from '../services/overlayService.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * GET /custom
 * List active custom collections in user session sandbox
 */
export const listCollections = async (req, res, next) => {
  try {
    const data = await getCustomCollections(req.identityId);
    return res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /custom/seed
 * Seed pre-built domain mock data template
 */
export const seedTemplate = async (req, res, next) => {
  try {
    const template = req.query.template || req.body.template || 'ecommerce';
    const result = await seedCustomTemplate(req.identityId, template);
    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /custom/:collection
 */
export const listCustomRecords = async (req, res, next) => {
  try {
    const collection = req.params.collection.toLowerCase();
    const resource = `custom_${collection}`;

    const { page, limit, _sort, _order, q, ...filters } = req.query;
    const paginated = await getPaginatedResource(req.identityId, resource, {
      page,
      limit,
      filters,
      _sort,
      _order,
      q
    });

    return res.status(200).json(paginated);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /custom/:collection/:id
 */
export const getCustomRecord = async (req, res, next) => {
  try {
    const collection = req.params.collection.toLowerCase();
    const resource = `custom_${collection}`;
    const record = await getSingleResource(req.identityId, resource, req.params.id);

    if (!record) {
      throw new AppError(`Record '${req.params.id}' not found in custom collection '${collection}'`, 404);
    }
    return res.status(200).json(record);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /custom/:collection
 */
export const createCustomRecord = async (req, res, next) => {
  try {
    const collection = req.params.collection.toLowerCase();
    const resource = `custom_${collection}`;
    const created = await createOverlayRecord(req.identityId, resource, req.body);
    return res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /custom/:collection/:id & PATCH /custom/:collection/:id
 */
export const updateCustomRecord = async (req, res, next) => {
  try {
    const collection = req.params.collection.toLowerCase();
    const resource = `custom_${collection}`;
    const isMerge = req.method === 'PATCH';
    const updated = await updateOverlayRecord(req.identityId, resource, req.params.id, req.body, isMerge);
    return res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /custom/:collection/:id
 */
export const deleteCustomRecord = async (req, res, next) => {
  try {
    const collection = req.params.collection.toLowerCase();
    const resource = `custom_${collection}`;
    await deleteOverlayRecord(req.identityId, resource, req.params.id);
    return res.status(200).json({
      message: `Record '${req.params.id}' removed from custom collection '${collection}'`
    });
  } catch (err) {
    next(err);
  }
};
