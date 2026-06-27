/**
 * @file src/app/(auth)/sign-in/page.tsx
 * @description Sign In Page Route (Server Component)
 * 
 * --- PLACEMENT INTERVIEW BRIEFING ---
 * 
 * 1. WHY SERVER-SIDE CHECK ON THE LOGIN PAGE?
 *    If a user has already logged in (they have an active, valid session cookie), they should never see the 
 *    login form again if they navigate back to `/sign-in`.
 *    - **Why check on the server?** By verifying the session in the Server Component *before* sending any HTML to the browser, 
 *      we can issue an instant redirect response (`/`) if they are already logged in. This avoids flashing a loading spinner, 
 *      flickering forms, or running redundant browser JavaScript.
 * 
 * 2. CONTROL FLOW:
 *    - Next.js runs this Server Component.
 *    - We fetch request headers using `await headers()`.
 *    - We pass these headers to `auth.api.getSession()` to check if the browser has a valid Better Auth session cookie.
 *    - If a valid session is resolved (`!!session` is true), we redirect immediately to the protected dashboard root (`/`).
 *    - Otherwise, we proceed to render the `<SignInView />` client component for unauthenticated users.
 */

import { SignInView } from "@/modules/auth/ui/views/sign-in-views"
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

const Page = async () => {
    // 1. Check if user session already exists in the request headers
    const session = await auth.api.getSession({
        headers: await headers()
    });

    // 2. If an active session is found, redirect user immediately to home dashboard page
    if (!!session) {
        redirect("/")
    }

    // 3. Render the public SignInView component for guest users
    return (
        <SignInView />
    )
}

export default Page