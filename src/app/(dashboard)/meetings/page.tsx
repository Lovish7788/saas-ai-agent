import { MeetingsViewError, MeetingsViewLoading, MeetingView } from "@/modules/meetings/ui/views/meetings-view";
import { MeetingsListHeader } from "@/modules/meetings/ui/components/meetings-list-header"; // Imported list header component
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const Page = async () => {
    const queryClient = getQueryClient();

    // Server-side prefetch query using server-side trpc client
    void queryClient.prefetchQuery(
        trpc.meetings.getMany.queryOptions({})
    );

    return (
        <>
            {/* Display meetings list header component */}
            <MeetingsListHeader />
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Suspense fallback={<MeetingsViewLoading />}>
                    <ErrorBoundary fallback={<MeetingsViewError />}>
                        <MeetingView />
                    </ErrorBoundary>
                </Suspense>
            </HydrationBoundary>
        </>
    );
};

export default Page;