export const parsePrice = (value: string): number | undefined => {
  if (!value.trim()) return undefined;
  const num = Number(value.replace(',', '.'));
  return Number.isNaN(num) ? undefined : num;
};
