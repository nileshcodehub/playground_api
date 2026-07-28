const FORBIDDEN_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

/**
 * Recursively sanitizes request body objects to prevent JavaScript prototype pollution,
 * while preserving all valid user-supplied keys and nested data structures.
 */
export function sanitizePayload(data) {
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(sanitizePayload);
  }

  const sanitized = {};
  for (const key of Object.keys(data)) {
    if (FORBIDDEN_KEYS.has(key)) {
      continue;
    }
    sanitized[key] = sanitizePayload(data[key]);
  }
  return sanitized;
}
