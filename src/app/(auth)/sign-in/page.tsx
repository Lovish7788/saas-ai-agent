// Sign In Page (Server Component)
import { SignInView } from "@/modules/auth/ui/views/sign-in-views"
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

const Page = async () => {
    // Check if user session already exists
    const session = await auth.api.getSession({
        headers: await headers()
    });

    // If an active session is found, redirect user immediately to home page
    if (!!session) {
        redirect("/")
    }

    // Render the custom SignInView component
    return (
        <SignInView />
    )
}

export default Page