/**
 * @file src/lib/auth-client.ts
 * @description Better Auth Client-side Initializer (React/Next.js Client Components)
 * 
 * --- PLACEMENT INTERVIEW BRIEFING ---
 * 
 * 1. CLIENT-SIDE VS SERVER-SIDE AUTHENTICATION:
 *    - Server-side auth (`auth.ts`): Interacts directly with the database, verifies credentials, creates session cookies, 
 *      and intercepts requests at the server level (Server Components, API routes).
 *    - Client-side auth (`auth-client.ts`): Runs entirely in the browser. It communicates with the backend API routes 
 *      using Fetch requests to execute actions (log in, sign up, sign out) and exposes reactivity (like React hooks) 
 *      to dynamically update the frontend UI.
 * 
 * 2. WHAT IS `createAuthClient`?
 *    It is a builder function provided by `better-auth/react` that generates custom React hooks and functions, 
 *    such as `useSession()`, `signIn()`, and `signOut()`.
 * 
 * 3. INTERVIEWER PRO-TIP:
 *    Explain how the React client communicates. For instance, when a user clicks "Logout", the client calls 
 *    `authClient.signOut()`, which makes a `POST /api/auth/sign-out` request behind the scenes. This clears the 
 *    session cookie in the browser and updates the local state to trigger a router redirect.
 */

import { createAuthClient } from "better-auth/react"

// Instantiate the Client-Side Auth instance.
// This instance generates react hooks (e.g., authClient.useSession()) that keep UI state in sync with auth cookies.
export const authClient = createAuthClient({});