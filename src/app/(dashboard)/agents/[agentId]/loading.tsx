import { LoadingState } from "@/components/loading-state";

export default function Loading() {
    return (
        <div className="p-6">
            <LoadingState 
                title="Loading Agent Details" 
                description="Fetching agent configuration, please wait" 
            />
        </div>
    );
}
