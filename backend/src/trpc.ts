import { t } from "./trpc-core.js";
import { rateLimitMiddleware } from "./middlewares/rateLimit.js";

export const router = t.router;

export const publicProcedure = t.procedure;
export const rateLimitedProcedure = t.procedure.use(rateLimitMiddleware);
