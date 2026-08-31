/**
 * Simple client-side rate limiter for sensitive actions
 * This prevents rapid-fire requests from the UI
 * Note: Real rate limiting should be done server-side (the Express backend can add middleware)
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

export interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxAttempts: 5,
  windowMs: 60 * 1000, // 1 minute
};

/**
 * Check if an action is rate limited
 * @param key - Unique identifier for the action (e.g., 'login', 'signup', 'reset-password')
 * @param config - Rate limit configuration
 * @returns Object with isLimited status and remaining time
 */
export const checkRateLimit = (
  key: string,
  config: RateLimitConfig = DEFAULT_CONFIG
): { isLimited: boolean; remainingMs: number; attemptsLeft: number } => {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  // No entry or window expired - allow and reset
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return {
      isLimited: false,
      remainingMs: 0,
      attemptsLeft: config.maxAttempts - 1,
    };
  }

  // Within window - check count
  if (entry.count >= config.maxAttempts) {
    return {
      isLimited: true,
      remainingMs: entry.resetTime - now,
      attemptsLeft: 0,
    };
  }

  // Increment count
  entry.count++;
  rateLimitMap.set(key, entry);

  return {
    isLimited: false,
    remainingMs: 0,
    attemptsLeft: config.maxAttempts - entry.count,
  };
};

/**
 * Reset rate limit for a specific key
 */
export const resetRateLimit = (key: string): void => {
  rateLimitMap.delete(key);
};

/**
 * Rate limit configurations for different actions
 */
export const RATE_LIMITS = {
  LOGIN: { maxAttempts: 5, windowMs: 60 * 1000 }, // 5 attempts per minute
  SIGNUP: { maxAttempts: 3, windowMs: 60 * 1000 }, // 3 attempts per minute
  PASSWORD_RESET: { maxAttempts: 3, windowMs: 5 * 60 * 1000 }, // 3 attempts per 5 minutes
  API_CALL: { maxAttempts: 100, windowMs: 60 * 1000 }, // 100 calls per minute
};

/**
 * Format remaining time for display
 */
export const formatRemainingTime = (ms: number): string => {
  const seconds = Math.ceil(ms / 1000);
  if (seconds < 60) return `${seconds} seconds`;
  const minutes = Math.ceil(seconds / 60);
  return `${minutes} minute${minutes > 1 ? 's' : ''}`;
};
