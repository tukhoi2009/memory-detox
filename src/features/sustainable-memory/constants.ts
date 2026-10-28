/** Thời chờ củng cố sau khi đọc (ms) */
export const MEMORY_COOLDOWN_MS = __DEV__
  ? 30 * 1000
  : 2 * 60 * 60 * 1000 + 15 * 60 * 1000
