export const sortByPosition = <T extends { id: number; position?: number }>(
  items: T[] = []
): T[] => {
  return [...items].sort(
    (a, b) => (a.position ?? 0) - (b.position ?? 0) || a.id - b.id
  );
};

export const withSequentialPositions = <T extends { position?: number }>(
  items: T[]
): T[] => {
  return items.map((item, position) => ({ ...item, position }));
};

export const toPositionPayload = <T extends { id: number }>(items: T[]) => {
  return items
    .filter(item => item.id > 0)
    .map((item, position) => ({ id: item.id, position }));
};
