import { db } from "@/db";
import { createTRPCRouter, baseProcedure, protectedProcedure } from "@/trpc/init";
import { agents, user } from "@/db/schema";
import { agentInsertSchema } from "@/modules/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { sql , and, ilike, desc, count} from "drizzle-orm";

import {DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE} from "@/constants";

export const agentsRouter = createTRPCRouter({
  // 1. Query to select a single agent (performs join to return owner username)
  getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
    const [existingAgent] = await db.select({
      id: agents.id,
      name: agents.name,
      userId: agents.userId,
      instructions: agents.instructions,
      createdAt: agents.createdAt,
      updatedAt: agents.updatedAt,
      meetingCount: sql<number>`5`,
      username: user.name
    })
      .from(agents)
      .innerJoin(user, eq(agents.userId, user.id))
      .where(eq(agents.id, input.id));
    return existingAgent;
  }),

  // 2. Query to select all agents from database with pagination and search
  getMany: protectedProcedure
  .input(z.object({
    page: z.number().default(DEFAULT_PAGE),
    pageSize: z.number()
    .min(MIN_PAGE_SIZE)
    .max(MAX_PAGE_SIZE)
    .default(DEFAULT_PAGE_SIZE),
    search: z.string().nullish()
  }))
  .query(async ({ctx, input}) => {
    const {search , page , pageSize}= input
    const data = await db.select({
      id: agents.id,
      name: agents.name,
      userId: agents.userId,
      instructions: agents.instructions,
      createdAt: agents.createdAt,
      updatedAt: agents.updatedAt,
      meetingCount: sql<number>`5`,
      username: user.name
    }).from(agents)
    .innerJoin(user, eq(agents.userId, user.id))
    .where(
      and(
        eq(agents.userId , ctx.auth.user.id),
        search ? ilike(agents.name, `%${input.search}%`) : undefined
      )
    ).orderBy(desc(agents.createdAt), desc(agents.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize)

    const total = await db.select({
      count: count()
    })
    .from(agents)
    .where(
      and(
        eq(agents.userId, ctx.auth.user.id),
        search ? ilike(agents.name, `%${input.search}%`) : undefined
      )
    )

    const totalPages = Math.ceil(total[0].count / pageSize)
    
    return {
      items: data,
      total: total[0].count,
      totalPages
    };
  }),

  // 3. Mutation to insert a new agent linked to the active session user
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

  // 4. Mutation to update an existing agent (enforces user ownership)
  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string(),
      instructions: z.string()
    }))
    .mutation(async ({ input, ctx }) => {
      const [updatedAgent] = await db
        .update(agents)
        .set({
          name: input.name,
          instructions: input.instructions
        })
        .where(
          and(
            eq(agents.id, input.id),
            eq(agents.userId, ctx.auth.user.id)
          )
        )
        .returning();
      return updatedAgent;
    }),

  // 5. Mutation to delete an existing agent (enforces user ownership)
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const [deletedAgent] = await db
        .delete(agents)
        .where(
          and(
            eq(agents.id, input.id),
            eq(agents.userId, ctx.auth.user.id)
          )
        )
        .returning();
      return deletedAgent;
    }),
});
