export function estimateCapacity(hours, cost, percent) {
  if ([hours, cost, percent].some((v) => v === '' || v === null)) return null;
  const [h, c, p] = [hours, cost, percent].map(Number);
  if ([h, c, p].some((n) => !Number.isFinite(n) || n < 0) || h > 168 || c > 10000 || p > 100)
    return null;
  const monthlyHours = (h * 4.33 * p) / 100;
  return { monthlyHours, monthlyCapacityValue: monthlyHours * c };
}
