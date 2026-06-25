"use client"
// Home View Component
// This view represents the protected home page layout, which displays the active user session and handles logout.
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"




export const HomeView = () => {
    const router = useRouter();
    
    // Retrieve the active user session data on the client side
    const { data: session } = authClient.useSession();
    
    // Fallback loading UI if the session is not yet loaded or authenticated
    if (!session) {
        return (
            <p>Loading
                <h1>You are in home page</h1>
            </p>
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
 