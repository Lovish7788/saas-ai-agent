"use client"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"




export const HomeView = () => {
    const router = useRouter();
    const { data: session } = authClient.useSession();
    if (!session) {
        return (
            <p>Loading
                <h1>You are in home page</h1>
            </p>
        )
    }
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col gap-4">
                <h1>{session.user?.name}</h1>
                <Button onClick={() => authClient.signOut({
                    fetchOptions: {
                        onSuccess: () => router.push("/sign-in"),
                    },
                })}>Sign Out</Button>
            </div>
        </div>
    )
}

