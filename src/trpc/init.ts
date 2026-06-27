import { cache } from 'react';
import { initTRPC } from '@trpc/server';

// Create a context for the tRPC router (e.g., to access user session or request headers)
export const createTRPCContext = cache(async () => {
     return { 
         userId: 'user_123'
     };
});

// Initialize tRPC backend with the defined context type
const t = initTRPC.context<typeof createTRPCContext>().create();

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
