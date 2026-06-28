import { db } from "@/db";
import { createTRPCRouter, baseProcedure } from "@/trpc/init";
import { agents } from "@/db/schema";
import { z } from "zod";

// Schema for input validation when creating an agent
const createAgentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  instructions: z.string().min(1, "Instructions are required"),
});

export const agentsRouter = createTRPCRouter({
  // 1. Query to select all agents from database
  getMany: baseProcedure.query(async () => {
    const data = await db.select().from(agents);
    return data;
  }),
  
  // 2. Mutation to insert a new agent linked to the active session user
  create: baseProcedure
    .input(createAgentSchema)
    .mutation(async ({ input, ctx }) => {
      const [newAgent] = await db.insert(agents).values({
        name: input.name,
        instructions: input.instructions,
        // Link to context user or fallback to developer test ID if user is not loaded
        userId: ctx.userId || "zaQsvsJALZzUkCXdExzRrMGMp1EaVF5h",
      }).returning();
      
      return newAgent;
    }),
});
