"use client"
/**
 * @file src/modules/home/ui/views/home-view.tsx
 * @description Main Home Client View Component
 * 
 * --- PLACEMENT INTERVIEW BRIEFING ---
 * 
 * 1. CLIENT COMPONENT ("use client"):
 *    In Next.js, files prefixed with `"use client"` mark the boundary of client-side code execution. They run in the 
 *    browser, enabling interactivity, client-side React hooks (`useState`, `useEffect`, `useRouter`), and browser events.
 * 
 * 2. REACTIVE CLIENT SESSION HOOKS (authClient.useSession):
 *    The `authClient.useSession()` hook initiates a React context subscription. When the component mounts, it checks 
 *    the current session state (often checking cache or hitting the local endpoint `/api/auth/session`). It triggers a 
 *    re-render when the session loading state changes or when the user signs out.
 * 
 * 3. CLIENT-SIDE ROUTER (`useRouter`):
 *    We use the `useRouter()` hook from `next/navigation` for client-side routing. This navigates between pages 
 *    without causing a full browser page reload, ensuring a smooth Single Page Application (SPA) experience.
 * 
 * 4. LOGOUT FLOW (`authClient.signOut`):
 *    When the user clicks the "Sign Out" button, we trigger the `signOut()` method. It executes an asynchronous 
 *    network request (POST `/api/auth/sign-out`) to destroy the session token cookie. The `onSuccess` callback runs after 
 *    a successful network response, client-side routing the user back to the public `/sign-in` page.
 */

import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export const HomeView = () => {
    const router = useRouter();
    
    // Retrieve the active user session data on the client side dynamically
    const { data: session } = authClient.useSession();
    
    // Fallback loading UI if the session is not yet loaded or authenticated
    if (!session) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-2">
                <p className="text-muted-foreground animate-pulse text-sm">Loading...</p>
                <h1 className="text-xl font-medium">You are on the home page</h1>
            </div>
        )
    }
    
    // Main UI when user is authenticated
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col gap-4">
                {/* Welcomes user by their display name */}
                <h1>hello {session.user?.name}</h1>
                
                {/* Trigger log out flow via authClient and redirect to /sign-in on success */}
                <Button onClick={() => authClient.signOut({
                    fetchOptions: {
                        onSuccess: () => router.push("/sign-in"),
                    },
                })}>Sign Out</Button>
            </div>
        </div>
    )
}
 