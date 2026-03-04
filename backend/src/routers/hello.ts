import { z } from "zod";
import { router, rateLimitedProcedure } from "../trpc.js";

export const helloRouter = router({
  greeting: rateLimitedProcedure
    .input(z.object({ text: z.string().optional() }).optional())
    .query(({ input }) => {
      return {
        greeting: `Hello ${input?.text ?? "World"} from tRPC!`,
      };
    }),
});
