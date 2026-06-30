import { db } from "@/db";
import { createTRPCRouter, baseProcedure, protectedProcedure } from "@/trpc/init";
import { agents } from "@/db/schema";
import { agentInsertSchema } from "@/modules/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";
export const agentsRouter = createTRPCRouter({

  getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
    const [existingAgent] = await db.select()
      .from(agents)
      .where(eq(agents.id, input.id));
    return existingAgent;
  }),

  // 1. Query to select all agents from database
  getMany: protectedProcedure.query(async () => {
    const data = await db.select().from(agents);
    return data;
  }),

  // 2. Mutation to insert a new agent linked to the active session user
  create: protectedProcedure
    .input(agentInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const [createAgent] = await db.insert(agents).values({
        name: input.name,
        instructions: input.instructions,
        userId: ctx.auth.user.id
      }).returning();

      return createAgent;
    }),
});
