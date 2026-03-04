import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { trpcServer } from "@hono/trpc-server";
import { rateLimiter } from "hono-rate-limiter";
import { appRouter } from "./trpc.js";
const app = new Hono();
// Rate limiting middleware: 100 requests per 15 minutes per IP
const limiter = rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: "draft-6",
    keyGenerator: (c) => c.req.header("x-forwarded-for") ?? "global",
});
// Apply rate limiter to all tRPC routes
app.use("/api/v1/*", limiter);
// Mount tRPC router
app.use("/api/v1/*", trpcServer({
    router: appRouter,
}));
app.get("/", (c) => {
    return c.text("Hono backend is running. Go to /api/v1/hello for tRPC.");
});
serve(app, () => {
    console.log("Server is running on http://localhost:3000");
});
export default app;
