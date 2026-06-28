import { db } from "@/db";
import { createTRPCRouter, baseProcedure } from "@/trpc/init";
import { agents } from "@/db/schema";
import { TRPCError } from "@trpc/server";

export const agentsRouter = createTRPCRouter({
    // Backend procedure to select and return all agents from the database
    getMany: baseProcedure.query(async () => {
        const data = await db.select().from(agents);
        return data;
    }),
});
