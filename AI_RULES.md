# AI RULES

## Fullstack Architecture

This project uses a modern fullstack architecture. AI agents working on this project must adhere to these standards:

### 1. Backend (Hono + tRPC)

- **Framework**: Hono running on Node.js using `@hono/node-server`.
- **API Protocol**: tRPC. Endpoints are organized systematically using sub-routers.
  - **Base Configuration**: `backend/src/trpc.ts` holds the base initialization (`publicProcedure`, `rateLimitedProcedure`).
  - **Creating Routers**: Sub-routers belong in `backend/src/routers/`. E.g., `routers/hello.ts`.
  - **Combining Routers**: Sub-routers are merged inside `backend/src/routers/index.ts` under `appRouter`.
  - **Adding a New Route**:
    1. Create a file `backend/src/routers/feature.ts`.
    2. Import `router` and procedures from `../trpc.js`. Define your endpoints: `export const featureRouter = router({ ... })`.
    3. Import the `featureRouter` into `backend/src/routers/index.ts`.
    4. Register it within `appRouter`: `export const appRouter = router({ feature: featureRouter })`.
    5. The frontend will automatically access it via `trpc.feature.endpointName`.
- **Prefix**: The tRPC server is mounted at `/api/v1/*`.
- **Validation**: Strict validation using `zod` for all endpoint inputs and outputs.
- **Middlewares**: tRPC middlewares are stored in `backend/src/middlewares/`.
  - `rateLimitMiddleware`: Restricts requests to 100 per 15 mins per IP. Use it for public but sensitive endpoints (e.g., login, global data fetching) by using `rateLimitedProcedure`.
  - `publicProcedure`: The default procedure with no rate limits. Use for general queries.
  - **Creating New Middleware**:
    1. Create a new file in `backend/src/middlewares/` (e.g., `auth.ts`).
    2. Import the `t` instance: `import { t } from "../trpc-core.js";`
    3. Define and export the middleware: `export const authMiddleware = t.middleware(({ ctx, next }) => { ... });`
    4. Import the middleware in `backend/src/trpc.ts` and chain it to a procedure: `export const protectedProcedure = t.procedure.use(authMiddleware);`

### 2. Frontend (React + Vite + Tailwind + shadcn/ui)

- **Framework**: Vite + React + TypeScript.
- **Styling**: Tailwind CSS v4. Do NOT use inline styles unless strictly necessary for dynamic calculations.
- **UI Components**:
  - Always prioritize using **shadcn/ui** components. Check `.agent/shadcn/components/` for available configurations.
  - To install a new component, use `npx shadcn@latest add <component-name>`.
  - Reusability: Custom components should be built to be reusable, consistent, and adhere to a responsive design layout.
- **Routing**: `TanStack Router` is used with code-based routing (or file-based if extended). Keep route definitions centralized or colocated correctly.
- **Data Fetching**: `tRPC React Query` adapter is the standard way to fetch data. Do not use raw `fetch` for endpoints covered by the tRPC router.

### 3. Development Workflow

- Follow the structure defined in these rules.
- Do not introduce redundant state management tools unless React Query and component state are insufficient.
- Write strict TypeScript types for all custom hooks, utilities, and components.
- Make sure to review the existing UI layouts inside `src/App.tsx` and maintain the aesthetic quality.
