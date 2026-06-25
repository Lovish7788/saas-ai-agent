// Main Protected Home Page (Server Component)
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { HomeView } from "@/modules/home/ui/views/home-view"

const Page = async () => {
  // Perform a server-side session check using request headers
  const session = await auth.api.getSession({
    headers: await headers()
  });

  // If the user is not authenticated, redirect them to the Sign In page
  if (!session) {
    redirect("/sign-in")
  }

  // If authenticated, render the client-side HomeView component
  return (
    <HomeView />
  )
}

export default Page