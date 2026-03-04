import { Hono } from "hono";
import { serve } from "@hono/node-server";

const app = new Hono();

const welcomeStrings = ["Hello Hono!", "Halo kakrey"];

app.get("/", (c) => {
  return c.text(welcomeStrings.join("\n\n"));
});

serve(app, () => {
  console.log("Server is running on http://localhost:3000");
});

export default app;
