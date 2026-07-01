import { MeetingIdView, MeetingIdViewLoading, MeetingIdViewError } from "@/modules/meetings/ui/views/meeting-id-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface PageProps {
    params: Promise<{
        meetingId: string;
    }>;
}

const Page = async ({ params }: PageProps) => {
    const { meetingId } = await params;
    const queryClient = getQueryClient();

    // Prefetch single meeting record on the server side to seed query cache
    void queryClient.prefetchQuery(
        trpc.meetings.getOne.queryOptions({ id: meetingId })
    );

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ErrorBoundary fallback={<MeetingIdViewError />}>
                <Suspense fallback={<MeetingIdViewLoading />}>
                    <MeetingIdView meetingId={meetingId} />
                </Suspense>
            </ErrorBoundary>
        </HydrationBoundary>
    );
};

export default Page;