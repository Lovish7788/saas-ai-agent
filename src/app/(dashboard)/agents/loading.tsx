import { LoadingState } from "@/components/loading-state";

export default function Loading() {
    return (
        <div className="p-6">
            <LoadingState 
                title="Loading Agents" 
                description="Fetching your AI agents, please wait" 
            />
        </div>
    );
}
