"use client";

/**
 * @file src/modules/meetings/ui/views/meetings-view.tsx
 * @description Meetings View Component rendering the list of meetings, loading fallback and error state.
 */

import { trpc } from "@/trpc/client";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";

export const MeetingView = () => {
    // Correct way: useSuspenseQuery returns a tuple where the first element is the response data
    const [data] = trpc.meetings.getMany.useSuspenseQuery({});

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold tracking-tight mb-4">Meetings</h1>
            <pre className="text-xs bg-muted p-4 rounded-xl border overflow-auto max-h-[80vh]">
                {JSON.stringify(data, null, 2)}
            </pre>
        </div>
    );
};

// Loading state fallback
export const MeetingsViewLoading = () => {
    return (
        <LoadingState 
            title="Loading Meetings" 
            description="Fetching your scheduled sessions, please wait" 
        />
    );
};

// Error state fallback
export const MeetingsViewError = () => {
    return (
        <ErrorState 
            title="Error Loading Meetings" 
            description="Failed to load meetings data from server" 
        />
    );
};