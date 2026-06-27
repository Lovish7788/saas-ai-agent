/**
 * @file src/app/(dashboard)/page.tsx
 * @description Main Protected Dashboard Landing Page (Server Component)
 * 
 * --- PLACEMENT INTERVIEW BRIEFING ---
 * 
 * 1. SERVER COMPONENT (RSC):
 *    By default in Next.js App Router, pages are Server Components. They execute solely on the server. This is 
 *    advantageous because we can safely retrieve session cookies and connect with our database or authorization 
 *    utilities without exposing sensitive credentials to the browser, and fetch data close to the source.
 * 
 * 2. SERVER-SIDE SESSION CHECK (auth.api.getSession):
 *    We pass `headers` (which contain the user's cookies) into `auth.api.getSession`. Better Auth reads the session 
 *    token cookie directly and queries the database session table to verify its validity.
 * 
 * 3. ROUTE PROTECTION:
 *    If the session is invalid or missing, we call the Next.js `redirect("/sign-in")` function. Under the hood, Next.js 
 *    throws a redirection error which is caught by the Next.js router runtime, terminating rendering and instantly 
 *    sending a `307 Temporary Redirect` response to the browser.
 * 
 * 4. HYBRID ARCHITECTURE (Server checks, Client views):
 *    We protect the route securely on the server side first. Once validated, we render the `<HomeView />` client component. 
 *    This prevents "flickering" layouts (where the client renders a loading spinner or flashes a public page before 
 *    verifying authentication).
 */

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { HomeView } from "@/modules/home/ui/views/home-view"

const Page = async () => {
  // 1. Perform server-side session check using request cookies/headers
  const session = await auth.api.getSession({
    headers: await headers()
  });

  // 2. Redirect to public sign-in if session is empty (Unauthorized)
  if (!session) {
    redirect("/sign-in")
  }

  // 3. Return client UI dashboard home view (Authorized)
  return (
    <HomeView />
  )
}

export default Page