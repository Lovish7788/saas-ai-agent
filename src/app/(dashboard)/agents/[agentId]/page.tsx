import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { AgentIdView, AgentIdViewLoading, AgentIdViewError } from "@/modules/agents/ui/views/agent-id-views";
import { ErrorBoundary } from "react-error-boundary";
interface Props {
    params: Promise<{ agentId: string }>;
}

const Page = async ({ params }: Props) => {
    const { agentId } = await params;
    const queryClient = getQueryClient();

    // Prefetch the database request on the server to seed cache
    void queryClient.prefetchQuery(
        trpc.agents.getOne.queryOptions({ id: agentId })
    );

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ErrorBoundary fallback={<AgentIdViewError />}>
                <Suspense fallback={<p className="p-8 text-sm text-muted-foreground animate-pulse"><AgentIdViewLoading /></p>}>
                    <AgentIdView agentId={agentId} />
                </Suspense>
            </ErrorBoundary>
        </HydrationBoundary>
    );
};

export default Page;