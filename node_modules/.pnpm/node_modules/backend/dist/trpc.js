import { initTRPC } from "@trpc/server";
import { z } from "zod";
const t = initTRPC.create();
export const router = t.router;
export const publicProcedure = t.procedure;
export const appRouter = router({
    hello: publicProcedure
        .input(z.object({ text: z.string().optional() }).optional())
        .query(({ input }) => {
        return {
            greeting: `Hello ${input?.text ?? "World"} from tRPC!`,
        };
    }),
});
