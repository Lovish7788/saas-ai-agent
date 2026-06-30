
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { HomeViewClient } from "@/modules/home/ui/views/home-view-client"

const Page = async () => {
  // 1. Perform server-side session check using request cookies/headers
  const session = await auth.api.getSession({
    headers: await headers()
  });

  // 2. Redirect to public sign-in if session is empty (Unauthorized)
  if (!session) {
    redirect("/sign-in")
  }

  // 3. Return client UI dashboard home view wrapper (Authorized)
  return (
    <HomeViewClient />
  )
}

export default Page