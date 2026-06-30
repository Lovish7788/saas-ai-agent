import { AgentsView, AgentsViewLoading } from "@/modules/agents/ui/views/agents-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { AgentListHeader } from "@/modules/agents/ui/components/agent-list-header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SearchParams } from "nuqs/server";
import { loadSearchParams } from "@/modules/agents/params";

interface Props {
    searchParams: Promise<SearchParams>
}

const page = async ({ searchParams }: Props) => {
    // 1. Load and parse raw search query parameters from Next.js request
    const params = await loadSearchParams(searchParams)

    // 2. Enforce server-side authentication redirect
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        redirect("/sign-in")
    }

    const queryClient = getQueryClient();

    // 3. Prefetch the database request on the server using parsed parameters (params)
    void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions({
        ...params
    }));

    return (
        <>
            <AgentListHeader />
            {/* Seed state cache to the client side during hydration */}
            <HydrationBoundary state={dehydrate(queryClient)}>
                {/* Fallback loader displayed while client suspends rendering */}
                <Suspense fallback={<AgentsViewLoading />}>
                    <AgentsView />
                </Suspense>
            </HydrationBoundary>
        </>
    );
};

export default page;