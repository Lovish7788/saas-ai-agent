"use client";

/**
 * @file src/modules/meetings/ui/components/meetings-list-header.tsx
 * @description Header for the meetings dashboard, trigger button for new meeting creation dialog.
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { NewMeetingDialog } from "./new-meeting-dialog"; // Import new meeting dialog

export const MeetingsListHeader = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <>
            {/* Controlled New Meeting Dialog */}
            <NewMeetingDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
            
            <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">My Meetings</h1>
                        <p className="text-sm text-muted-foreground">Schedule and review your virtual assistant interactions</p>
                    </div>
                    <Button 
                        onClick={() => setIsDialogOpen(true)}
                        className="bg-primary text-primary-foreground flex items-center gap-x-2 cursor-pointer"
                    >
                        <PlusIcon className="size-4" />
                        New Meeting
                    </Button>
                </div>
            </div>
        </>
    );
};