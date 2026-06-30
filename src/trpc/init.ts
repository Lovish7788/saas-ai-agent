import { cache } from 'react';
import { initTRPC , TRPCError } from '@trpc/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
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
export const protectedProcedure = baseProcedure.use(async ({ctx,next})=>{
      const session = await auth.api.getSession({
        headers: await headers()
      });
      if(!session)throw new TRPCError({code:"UNAUTHORIZED", message: "Unauthorized"});
      return next({
        ctx:{
          ...ctx , auth: session
        }
      })
})
