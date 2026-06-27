// Sign Up Page (Server Component)
import { SignUpView } from "@/modules/auth/ui/views/sign-up-view"
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

const Page = async() => {
    // Check if user session already exists
    const session = await auth.api.getSession({
        headers: await headers()
    })

    // If session is active, redirect to home page
    if (session){
        redirect("/")
    }

    // Render the custom SignUpView component
    return (
        <SignUpView />
    )
}

export default Page