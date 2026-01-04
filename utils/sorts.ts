export const mapOrder = <T>(
  originalArray: T[],
  orderArray: string[],
  key: keyof T
): T[] => {
  if (!originalArray || !orderArray || !key) return [];
  return [...originalArray].sort(
    (a, b) =>
      orderArray.indexOf(a[key] as string) -
      orderArray.indexOf(b[key] as string)
  );
};
