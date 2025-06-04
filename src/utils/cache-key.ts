export function getExpenseCacheKey(userId: string, period?: string): string {
  return period
    ? `expenses:${userId}:period:${period}`
    : `expenses:${userId}:all`;
}
