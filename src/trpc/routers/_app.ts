import { createTRPCRouter, baseProcedure } from '../init';

// Import future modules when created:
// import { agentsRouter } from '@/modules/agents/server/procedures';
// import { premiumRouter } from '@/modules/premium/server/procedures';
// import { meetingsRouter } from '@/modules/meetings/server/procedures';

export const appRouter = createTRPCRouter({
  // Temporary mock procedure to verify tRPC connection
  hello: baseProcedure.query(() => {
    return "Hello from tRPC!";
  }),
  // Future procedures:
  // agents: agentsRouter,
  // meetings: meetingsRouter,
  // premium: premiumRouter,
});

export type AppRouter = typeof appRouter;