import { v4 as uuidv4 } from 'uuid';
import prisma from '../db/prismaClient.js';
import { AppError } from '../middleware/errorHandler.js';

export const MAX_USER_CREATED_RECORDS = 30;

const GLOBAL_MODELS = {
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

  const { deletedIds, created } = await loadOverlay(identityId, resource);

  const createdIds = created.map(item => item.id);
  const globalIds = globalRows
    .map(row => row.id)
    .filter(id => !deletedIds.has(id));

  // Virtual list order: created items top (newest first), then global items preserving DB order
  return [...createdIds, ...globalIds];
};

export const getPaginatedResource = async (identityId, resource, { page = 1, limit = 10 } = {}) => {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(30, Math.max(1, parseInt(limit, 10) || 10));

  const virtualList = await getVirtualList(identityId, resource);
  const total = virtualList.length;
  const totalPages = Math.ceil(total / limitNum) || 1;

  const startIndex = (pageNum - 1) * limitNum;
  const pageSliceIds = virtualList.slice(startIndex, startIndex + limitNum);

  if (pageSliceIds.length === 0) {
    return {
      data: [],
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    };
  }

  const { updatesById, created } = await loadOverlay(identityId, resource);
  const createdMap = new Map(created.map(item => [item.id, item]));

  const globalIntIds = pageSliceIds
    .filter(id => typeof id === 'number')
    .map(id => parseInt(id, 10));

  const modelName = GLOBAL_MODELS[resource];
  const globalRecords = globalIntIds.length > 0
    ? await prisma[modelName].findMany({ where: { id: { in: globalIntIds } } })
    : [];

  const globalRecordMap = new Map(globalRecords.map(rec => [rec.id, rec]));

  const resultData = pageSliceIds.map(id => {
    if (typeof id === 'string' && id.startsWith('local-')) {
      return createdMap.get(id);
    }

    const baseRecord = globalRecordMap.get(id);
    if (!baseRecord) return null;

    if (updatesById.has(id)) {
      const patch = updatesById.get(id);
      return {
        ...baseRecord,
        ...(typeof patch === 'object' && patch !== null ? patch : {}),
        _sandbox: 'updated'
      };
    }

    return baseRecord;
  }).filter(Boolean);

  return {
    data: resultData,
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
