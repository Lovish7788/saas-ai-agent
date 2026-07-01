import { ResponsiveDialog } from "@/components/responsive-dialog";
import { MeetingForm } from "./meeting-form";
import { useRouter } from "next/navigation";

interface MeetingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const NewMeetingDialog = ({
    open,
    onOpenChange
}: MeetingDialogProps) => {
    const router = useRouter();
    return (
        <ResponsiveDialog
            title="New Meeting"
            description="Create a new Meeting"
            open={open}
            onOpenChange={onOpenChange}
        >
            <MeetingForm
                onSuccess={(id) => {
                    onOpenChange(false);
                    // Corrected route path from '/meeting/' to '/meetings/' (plural) to prevent error page redirects
                    router.push(`/meetings/${id}`);
                }}
                onCancel={() => {
                    onOpenChange(false);
                }}
            />
        </ResponsiveDialog>
    );
};