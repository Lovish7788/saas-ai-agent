"use client";

/**
 * @file src/modules/home/ui/views/home-view-client.tsx
 * @description Client-only wrapper for HomeView with SSR disabled.
 * 
 * --- PLACEMENT INTERVIEW BRIEFING ---
 * 
 * 1. WHY IS THIS WRAPPER NECESSARY?
 *    In Next.js, calling dynamic imports with `{ ssr: false }` is NOT allowed inside Server Components (like `page.tsx`). 
 *    Therefore, we create this wrapper component, mark it with `"use client"`, and load the real `<HomeView />` inside it.
 * 
 * 2. WHAT DOES THIS SOLVE?
 *    - Keeps the parent routing page (`page.tsx`) as a Server Component, meaning we check user authentication and perform 
 *      redirects directly on the server (which is highly secure and prevents page flashing).
 *    - Fully disables Server-Side Rendering (SSR) for the hook-dependent `<HomeView />` client view. This prevents 
 *      "Invalid hook call" errors during server-side pre-rendering.
 */

import dynamic from "next/dynamic";

export const HomeViewClient = dynamic(
  () => import("./home-view").then((mod) => mod.HomeView),
  { ssr: false }
);
