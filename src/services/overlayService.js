import { v4 as uuidv4 } from 'uuid';
import prisma from '../db/prismaClient.js';
import { AppError } from '../middleware/errorHandler.js';

export const MAX_USER_CREATED_RECORDS = 30;

// Exported so other modules (e.g. docsRoutes.js) can reference it without duplication
export const GLOBAL_MODELS = {
  users: 'usersGlobal',
  posts: 'postsGlobal',
  comments: 'commentsGlobal',
  todos: 'todosGlobal'
};

export const loadOverlay = async (identityId, resource) => {
  if (!identityId) {
    return { deletedIds: new Set(), updatesById: new Map(), created: [] };
  }

  const records = await prisma.overlayRecords.findMany({
    where: {
      identity_id: identityId,
      resource: resource
    },
    orderBy: { created_at: 'desc' }
  });

  const deletedIds = new Set();
  const updatesById = new Map();
  const created = [];

  for (const record of records) {
    if (record.op === 'delete' && record.target_id !== null) {
      deletedIds.add(record.target_id);
    } else if (record.op === 'update' && record.target_id !== null) {
      if (!deletedIds.has(record.target_id) && !updatesById.has(record.target_id)) {
        updatesById.set(record.target_id, record.data);
      }
    } else if (record.op === 'create') {
      created.push({
        id: `local-${record.id}`,
        ...(typeof record.data === 'object' && record.data !== null ? record.data : {}),
        _sandbox: 'created'
      });
    }
  }

  return { deletedIds, updatesById, created };
};

export const getVirtualList = async (identityId, resource) => {
  const modelName = GLOBAL_MODELS[resource];
  if (!modelName) {
    throw new AppError(`Unknown resource: ${resource}`, 400);
  }

  const globalRows = await prisma[modelName].findMany({
    select: { id: true },
    orderBy: { id: 'asc' }
  });

  const overlay = await loadOverlay(identityId, resource);
  const { deletedIds, created } = overlay;

  const createdIds = created.map(item => item.id);
  const globalIds = globalRows
    .map(row => row.id)
    .filter(id => !deletedIds.has(id));

  // Virtual list order: created items top (newest first), then global items preserving DB order
  // Also return the full overlay so callers can reuse it without a second DB query
  return { virtualList: [...createdIds, ...globalIds], overlay };
};

export const getAllMergedRecords = async (identityId, resource) => {
  const modelName = GLOBAL_MODELS[resource];
  if (!modelName) {
    throw new AppError(`Unknown resource: ${resource}`, 400);
  }

  const globalRows = await prisma[modelName].findMany({
    orderBy: { id: 'asc' }
  });

  const overlay = await loadOverlay(identityId, resource);
  const { deletedIds, updatesById, created } = overlay;

  const activeGlobalRecords = globalRows
    .filter(row => !deletedIds.has(row.id))
    .map(row => {
      if (updatesById.has(row.id)) {
        const patch = updatesById.get(row.id);
        return {
          ...row,
          ...(typeof patch === 'object' && patch !== null ? patch : {}),
          _sandbox: 'updated'
        };
      }
      return row;
    });

  // Created items top (newest first), then global items preserving DB order
  return [...created, ...activeGlobalRecords];
};

export const getPaginatedResource = async (identityId, resource, { page = 1, limit = 10, filters = {}, _sort, _order = 'asc' } = {}) => {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(30, Math.max(1, parseInt(limit, 10) || 10));

  // Step 1: Fetch all merged records
  let records = await getAllMergedRecords(identityId, resource);

  // Step 2: Apply Filters (01-feature-relational-filtering)
  const filterEntries = Object.entries(filters).filter(([_, val]) => val !== undefined && val !== null && val !== '');
  if (filterEntries.length > 0) {
    records = records.filter(item => {
      return filterEntries.every(([key, expectedValue]) => {
        const itemVal = item[key];
        if (itemVal === undefined) return false;

        if (typeof expectedValue === 'boolean') {
          return Boolean(itemVal) === expectedValue;
        }

        if (typeof expectedValue === 'number') {
          return Number(itemVal) === expectedValue;
        }

        return String(itemVal).toLowerCase() === String(expectedValue).toLowerCase();
      });
    });
  }

  // Step 3: Apply Dynamic Sorting (13-feature-dynamic-sorting)
  if (_sort && typeof _sort === 'string') {
    const sortKey = _sort.trim();
    const isDesc = String(_order).toLowerCase() === 'desc';

    records.sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];

      if (valA === undefined && valB === undefined) return 0;
      if (valA === undefined) return 1;
      if (valB === undefined) return -1;

      if (typeof valA === 'number' && typeof valB === 'number') {
        return isDesc ? valB - valA : valA - valB;
      }

      if (typeof valA === 'boolean' && typeof valB === 'boolean') {
        return isDesc ? (valB === valA ? 0 : valB ? 1 : -1) : (valA === valB ? 0 : valA ? 1 : -1);
      }

      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();

      if (strA < strB) return isDesc ? 1 : -1;
      if (strA > strB) return isDesc ? -1 : 1;
      return 0;
    });
  }

  // Step 4: Paginate
  const total = records.length;
  const totalPages = Math.ceil(total / limitNum) || 1;
  const startIndex = (pageNum - 1) * limitNum;
  const pageSlice = records.slice(startIndex, startIndex + limitNum);

  return {
    data: pageSlice,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1
    }
  };
};

export const getSingleResource = async (identityId, resource, publicId) => {
  const { deletedIds, updatesById, created } = await loadOverlay(identityId, resource);

  if (typeof publicId === 'string' && publicId.startsWith('local-')) {
    const found = created.find(item => item.id === publicId);
    return found || null;
  }

  const intId = parseInt(publicId, 10);
  if (isNaN(intId) || deletedIds.has(intId)) {
    return null;
  }

  const modelName = GLOBAL_MODELS[resource];
  if (!modelName) {
    throw new AppError(`Unknown resource: ${resource}`, 400);
  }

  const baseRecord = await prisma[modelName].findUnique({ where: { id: intId } });
  if (!baseRecord) return null;

  if (updatesById.has(intId)) {
    const patch = updatesById.get(intId);
    return {
      ...baseRecord,
      ...(typeof patch === 'object' && patch !== null ? patch : {}),
      _sandbox: 'updated'
    };
  }

  return baseRecord;
};

export const createOverlayRecord = async (identityId, resource, data) => {
  if (!identityId) {
    throw new AppError('Identity required for creating sandbox records', 401);
  }

  const currentCreatesCount = await prisma.overlayRecords.count({
    where: {
      identity_id: identityId,
      resource: resource,
      op: 'create'
    }
  });

  if (currentCreatesCount >= MAX_USER_CREATED_RECORDS) {
    throw new AppError(`Sandbox record limit reached (${MAX_USER_CREATED_RECORDS} records max for ${resource})`, 429);
  }

  const newUuid = uuidv4();
  const createdRecord = await prisma.overlayRecords.create({
    data: {
      id: newUuid,
      identity_id: identityId,
      resource: resource,
      op: 'create',
      data: data || {}
    }
  });

  return {
    id: `local-${createdRecord.id}`,
    ...(typeof data === 'object' && data !== null ? data : {}),
    _sandbox: 'created'
  };
};

export const updateOverlayRecord = async (identityId, resource, publicId, patch) => {
  if (!identityId) {
    throw new AppError('Identity required for updating sandbox records', 401);
  }

  if (typeof publicId === 'string' && publicId.startsWith('local-')) {
    const rawUuid = publicId.replace('local-', '');
    const existing = await prisma.overlayRecords.findFirst({
      where: { id: rawUuid, identity_id: identityId, resource: resource, op: 'create' }
    });

    if (!existing) {
      throw new AppError('Local record not found or not owned by session', 404);
    }

    const currentData = typeof existing.data === 'object' && existing.data !== null ? existing.data : {};
    const updatedData = { ...currentData, ...patch };

    await prisma.overlayRecords.update({
      where: { id: rawUuid },
      data: { data: updatedData }
    });

    return {
      id: publicId,
      ...updatedData,
      _sandbox: 'created'
    };
  }

  const intId = parseInt(publicId, 10);
  if (isNaN(intId)) {
    throw new AppError('Invalid ID format', 400);
  }

  const modelName = GLOBAL_MODELS[resource];
  const baseRecord = await prisma[modelName].findUnique({ where: { id: intId } });
  if (!baseRecord) {
    throw new AppError('Global record not found', 404);
  }

  // Upsert update record in overlay_records
  const existingOverlay = await prisma.overlayRecords.findFirst({
    where: { identity_id: identityId, resource: resource, target_id: intId }
  });

  let currentData = {};
  if (existingOverlay && existingOverlay.op === 'update' && existingOverlay.data) {
    currentData = existingOverlay.data;
  }

  const mergedData = { ...currentData, ...patch };

  if (existingOverlay) {
    await prisma.overlayRecords.update({
      where: { id: existingOverlay.id },
      data: { op: 'update', data: mergedData }
    });
  } else {
    await prisma.overlayRecords.create({
      data: {
        identity_id: identityId,
        resource: resource,
        target_id: intId,
        op: 'update',
        data: mergedData
      }
    });
  }

  return {
    ...baseRecord,
    ...mergedData,
    _sandbox: 'updated'
  };
};

export const deleteOverlayRecord = async (identityId, resource, publicId) => {
  if (!identityId) {
    throw new AppError('Identity required for deleting sandbox records', 401);
  }

  if (typeof publicId === 'string' && publicId.startsWith('local-')) {
    const rawUuid = publicId.replace('local-', '');
    const existing = await prisma.overlayRecords.findFirst({
      where: { id: rawUuid, identity_id: identityId, resource: resource, op: 'create' }
    });

    if (!existing) {
      throw new AppError('Local record not found', 404);
    }

    await prisma.overlayRecords.delete({ where: { id: rawUuid } });
    return true;
  }

  const intId = parseInt(publicId, 10);
  if (isNaN(intId)) {
    throw new AppError('Invalid ID format', 400);
  }

  const modelName = GLOBAL_MODELS[resource];
  const baseRecord = await prisma[modelName].findUnique({ where: { id: intId } });
  if (!baseRecord) {
    throw new AppError('Global record not found', 404);
  }

  const existingOverlay = await prisma.overlayRecords.findFirst({
    where: { identity_id: identityId, resource: resource, target_id: intId }
  });

  if (existingOverlay) {
    await prisma.overlayRecords.update({
      where: { id: existingOverlay.id },
      data: { op: 'delete', data: null }
    });
  } else {
    await prisma.overlayRecords.create({
      data: {
        identity_id: identityId,
        resource: resource,
        target_id: intId,
        op: 'delete',
        data: null
      }
    });
  }

  return true;
};

export const resetSessionOverlay = async (identityId) => {
  if (!identityId) {
    throw new AppError('Identity required to reset session sandbox', 401);
  }

  const { count } = await prisma.overlayRecords.deleteMany({
    where: { identity_id: identityId }
  });

  return { count };
};

export const cleanupInactiveIdentities = async (daysThreshold = 10) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysThreshold);

  const inactiveIdentities = await prisma.identities.findMany({
    where: {
      last_seen_at: {
        lt: cutoffDate
      }
    },
    select: { id: true }
  });

  if (inactiveIdentities.length === 0) {
    return 0;
  }

  const inactiveIds = inactiveIdentities.map((i) => i.id);

  await prisma.$transaction([
    prisma.overlayRecords.deleteMany({
      where: { identity_id: { in: inactiveIds } }
    }),
    prisma.identities.deleteMany({
      where: { id: { in: inactiveIds } }
    })
  ]);

  return inactiveIds.length;
};

