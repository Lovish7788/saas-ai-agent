import {z} from "zod";
import {agentsRouter} from "@/modules/agents/server/procedures"
import {meetingsRouter} from "@/modules/meetings/server/procedures"
import {premiumRouter} from "@/modules/premium/server/procedures"
import { createTRPCRouter, baseProcedure } from '../init';

// Import future modules when created:
// import { agentsRouter } from '@/modules/agents/server/procedures';
// import { premiumRouter } from '@/modules/premium/server/procedures';
// import { meetingsRouter } from '@/modules/meetings/server/procedures';

export const appRouter = createTRPCRouter({
  agents: agentsRouter,
  meetings: meetingsRouter,
  premium: premiumRouter,
});

export type AppRouter = typeof appRouter;