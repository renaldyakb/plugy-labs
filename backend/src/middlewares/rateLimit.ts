import { t } from "../trpc-core.js";

// Simple in-memory rate limiter per IP
const requestCounts = new Map<string, { count: number; expires: number }>();
const RATE_LIMIT_SEC = 12 * 60 * 60; // 12 hours
const MAX_REQUESTS = 50;

export const rateLimitMiddleware = t.middleware(({ ctx, next }) => {
  // skip rate limit in development
  if (process.env.NODE_ENV === "development") {
    return next();
  }

  // Assuming you can get the IP from your context, if passed down from Hono
  // For now, we'll use a global fallback if IP isn't available in ctx
  const ip = (ctx as any)?.ip ?? "global-ip";
  const now = Date.now();
  let record = requestCounts.get(ip);

  if (!record || record.expires < now) {
    record = { count: 1, expires: now + RATE_LIMIT_SEC * 1000 };
  } else {
    record.count++;
  }

  requestCounts.set(ip, record);

  if (record.count > MAX_REQUESTS) {
    throw new Error("Too many requests, please try again later.");
  }

  return next();
});
