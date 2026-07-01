import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const premiumRouter = createTRPCRouter({
  // 1. Mock query to return free usage statistics for compiling client code
  getFreeUsage: protectedProcedure.query(async () => {
    return {
      used: 0,
      limit: 5
    };
  })
});
