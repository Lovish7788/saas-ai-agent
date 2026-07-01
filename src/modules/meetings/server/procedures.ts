import { db } from "@/db";
import { createTRPCRouter, baseProcedure, protectedProcedure } from "@/trpc/init";
import { meetings, agents } from "@/db/schema";
import { meetingInsertSchema, meetingUpdateSchema } from "@/modules/meetings/schema"; // Import insert and update schemas
import { z } from "zod";
import { eq } from "drizzle-orm";
import { sql , and, ilike, desc, count} from "drizzle-orm";

import {DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE} from "@/constants";

export const meetingsRouter = createTRPCRouter({
  // 1. Query to select a single meeting details (joins agents table to return agent metadata)
  getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
    const [existingMeeting] = await db.select({
      id: meetings.id,
      name: meetings.name,
      status: meetings.status,
      startedAt: meetings.startedAt,
      endedAt: meetings.endedAt,
      transcriptUrl: meetings.transcriptUrl,
      recordingUrl: meetings.recordingUrl,
      summary: meetings.summary,
      createdAt: meetings.createdAt,
      updatedAt: meetings.updatedAt,
      agentId: meetings.agentId,
      agentName: agents.name,
      agentInstructions: agents.instructions
    })
      .from(meetings)
      .innerJoin(agents, eq(meetings.agentId, agents.id))
      .where(
        and(
          eq(meetings.id, input.id),
          eq(meetings.userId, ctx.auth.user.id)
        )
      );
    return existingMeeting;
  }),

  // 2. Query to select all meetings from database with pagination and search
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
      id: meetings.id,
      name: meetings.name,
      status: meetings.status,
      startedAt: meetings.startedAt,
      endedAt: meetings.endedAt,
      createdAt: meetings.createdAt,
      updatedAt: meetings.updatedAt,
      agentId: meetings.agentId,
      agentName: agents.name
    }).from(meetings)
    .innerJoin(agents, eq(meetings.agentId, agents.id))
    .where(
      and(
        eq(meetings.userId , ctx.auth.user.id),
        search ? ilike(meetings.name, `%${input.search}%`) : undefined
      )
    ).orderBy(desc(meetings.createdAt), desc(meetings.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize)

    const total = await db.select({
      count: count()
    })
    .from(meetings)
    .where(
      and(
        eq(meetings.userId, ctx.auth.user.id),
        search ? ilike(meetings.name, `%${input.search}%`) : undefined
      )
    )

    const totalPages = Math.ceil(total[0].count / pageSize)
    
    return {
      items: data,
      total: total[0].count,
      totalPages
    };
  }),

  // 3. Mutation to create a new meeting
  create: protectedProcedure
    .input(meetingInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const [createMeeting] = await db
        .insert(meetings)
        .values({
          name: input.name,
          agentId: input.agentId,
          userId: ctx.auth.user.id
        })
        .returning();
      
      return createMeeting;
    }),

  // 4. Mutation to update an existing meeting
  update: protectedProcedure
    .input(meetingUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      const [updatedMeeting] = await db
        .update(meetings)
        .set({
          name: input.name,
          agentId: input.agentId
        })
        .where(
          and(
            eq(meetings.id, input.id),
            eq(meetings.userId, ctx.auth.user.id)
          )
        )
        .returning();
      
      return updatedMeeting;
    }),
});
