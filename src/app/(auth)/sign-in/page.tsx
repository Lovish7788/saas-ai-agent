
import { SignInView } from "@/modules/auth/ui/views/sign-in-views"
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";


const Page = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!!session) {
        // if session already exists
        redirect("/")
    }
    return (
        <SignInView />
    )
}

export default Page