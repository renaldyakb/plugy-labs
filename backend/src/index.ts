import { Hono, Context } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "./routers/index.js";

const app = new Hono();

app.use("*", logger());
app.use(
  "*",
  cors({
    origin: (origin) => {
      // In development, allow localhost/local network
      if (process.env.NODE_ENV === "development") {
        return origin;
      }
      // In production, strictly enforce allowed origins via ENV
      // Example .env: ALLOWED_ORIGINS=https://plugy-labs.web.app,https://my-domain.com
      const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];

      if (origin && allowedOrigins.includes(origin)) {
        return origin;
      }
      // Fallback
      return allowedOrigins[0] || "http://localhost:5173";
    },
  }),
);

// Mount tRPC router
app.use(
  "/api/v1/*",
  trpcServer({
    router: appRouter,
  }),
);

app.get("/", (c) => {
  return c.text("Go to /api/v1/hello");
});

serve(app, () => {
  console.log("Server is running on http://localhost:3000");
});

export default app;
