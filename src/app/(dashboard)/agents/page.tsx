import { AgentsView, AgentsViewLoading } from "@/modules/agents/ui/views/agents-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

const page = async () => {
    // 1. Initialize the query client for server-side fetching
    const queryClient = getQueryClient();
    
    // 2. Prefetch the database request on the server to seed the query cache
    void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions());

    return (
        <div>
            {/* Seed state cache to the client side during hydration */}
            <HydrationBoundary state={dehydrate(queryClient)}>
                {/* Fallback loader displayed while client suspends rendering */}
                <Suspense fallback={<AgentsViewLoading />}>
                    <AgentsView />
                </Suspense>
            </HydrationBoundary>
        </div>
    );
};

export default page;