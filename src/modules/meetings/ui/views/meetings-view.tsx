"use client";

/**
 * @file src/modules/meetings/ui/views/meetings-view.tsx
 * @description Meetings View Component rendering the list of meetings, with a fallback for empty states.
 */

import { trpc } from "@/trpc/client";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { EmptyState } from "@/components/empty-state";
import { DataTable } from "@/components/data-table";
import { columns } from "../components/colums";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { NewMeetingDialog } from "../components/new-meeting-dialog"; // Import new meeting dialog

export const MeetingView = () => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false); // Controlled dialog state

    // Correct way: useSuspenseQuery returns a tuple where the first element is the response data
    const [data] = trpc.meetings.getMany.useSuspenseQuery({});
    const meetingsList = data.items;

    // Display clean empty state graphic and dialog trigger when there are no scheduled meetings
    if (meetingsList.length === 0) {
        return (
            <>
                <NewMeetingDialog open={isOpen} onOpenChange={setIsOpen} />
                <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed rounded-xl bg-card shadow-inner gap-y-4 mt-8">
                    <EmptyState
                        title="No meetings found"
                        description="You haven't created any meetings yet. Click the button below to schedule your first meeting session."
                    />
                    <Button
                        onClick={() => setIsOpen(true)}
                        className="bg-primary text-primary-foreground cursor-pointer flex items-center gap-x-2 mt-4"
                    >
                        <PlusIcon className="size-4" />
                        Create your first meeting
                    </Button>
                </div>
            </>
        );
    }

    return (
        <div className="py-4 px-4 md:px-8">
            <DataTable 
                columns={columns} 
                data={meetingsList} 
                onRowClick={(row) => router.push(`/meetings/${row.id}`)}
            />
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