import { LoadingState } from "@/components/loading-state";

export default function Loading() {
    return (
        <div className="p-6">
            <LoadingState 
                title="Loading Meetings" 
                description="Fetching your scheduled sessions, please wait" 
            />
        </div>
    );
}
