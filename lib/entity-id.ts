import type { EntityId } from '@/config/interface';

export const toEntityId = (value: string | number): EntityId => {
  const id = typeof value === 'number' ? value : Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error(`Invalid entity id: ${value}`);
  }

  return id;
};

export const toEntityIdOrUndefined = (
  value?: string | number | null
): EntityId | undefined => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  return toEntityId(value);
};

export const toEntityIdOrNull = (
  value?: string | number | null
): EntityId | null => {
  return toEntityIdOrUndefined(value) ?? null;
};

export const toSelectValue = (value?: string | number | null): string => {
  return value === undefined || value === null ? '' : String(value);
};
