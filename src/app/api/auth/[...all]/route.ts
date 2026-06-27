/**
 * @file src/app/api/auth/[...all]/route.ts
 * @description Better Auth catch-all API handler for Next.js App Router.
 * 
 * --- PLACEMENT INTERVIEW BRIEFING ---
 * 
 * 1. WHAT IS CATCH-ALL ROUTING ([...all])?
 *    In Next.js, enclosing a directory name in brackets with three dots (e.g. `[...all]`) creates a "catch-all segment". 
 *    This means any sub-request under `/api/auth` (e.g. `/api/auth/sign-in`, `/api/auth/sign-up`, `/api/auth/sign-out`, `/api/auth/session`) 
 *    will be automatically captured and handled by this single `route.ts` file.
 * 
 * 2. WHAT IS `toNextJsHandler`?
 *    Better Auth is framework-agnostic (it works with Express, Hono, SolidStart, Astro, etc.). The `toNextJsHandler` utility 
 *    converts the core Better Auth server instance (`auth`) into standard Next.js GET/POST Request Handlers.
 * 
 * 3. CONTROL FLOW:
 *    - Next.js receives a request at `/api/auth/some-action`.
 *    - Next.js routes this request here due to the `[...all]` folder structure.
 *    - `toNextJsHandler` processes the request URL path and method (GET/POST), delegates it to Better Auth to perform the 
 *      corresponding database queries or session actions, and returns the formatted HTTP Response.
 */

import { auth } from "@/lib/auth"; 
import { toNextJsHandler } from "better-auth/next-js";

// Export standard Next.js route handlers mapping GET and POST request verbs.
export const { POST, GET } = toNextJsHandler(auth);