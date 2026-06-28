"use client";

/**
 * @file src/modules/agents/ui/views/agents-view.tsx
 * @description Agents View Component with native tRPC Suspense queries
 * 
 * --- PLACEMENT INTERVIEW BRIEFING ---
 * 
 * 1. WHY REACT SUSPENSE (useSuspenseQuery)?
 *    Suspense allows components to "wait" for asynchronous operations (like tRPC database queries) before rendering.
 *    - **No more loading/error states in the component itself**: The loading fallback is handled higher up in 
 *      the tree by `<Suspense fallback={<AgentsViewLoading />} />`. The error boundary catches network crashes.
 *    - **Guaranteed Data**: In the component body, `agentsList` is guaranteed to be fully loaded, removing 
 *      unnecessary null-checks and rendering bugs.
 */

import { trpc } from "@/trpc/client";
import { LoadingState } from "@/components/loading-state";

export const AgentsView = () => {
    // Under React Suspense, we use the auto-generated useSuspenseQuery hook.
    // It returns the response data directly as a tuple destructured variable.
    const [agentsList] = trpc.agents.getMany.useSuspenseQuery();

    return (
        <div className="flex flex-col gap-y-4 p-6">
            <h1 className="text-xl font-bold">Your AI Agents</h1>
            
            {agentsList && agentsList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {agentsList.map((agent) => (
                        <div key={agent.id} className="p-4 border rounded-xl bg-card text-card-foreground shadow-sm flex flex-col gap-y-2">
                            <h2 className="font-semibold text-base">{agent.name}</h2>
                            <p className="text-xs text-muted-foreground line-clamp-3 bg-muted p-2 rounded-lg">
                                <strong>Instructions:</strong> {agent.instructions}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center p-8 border border-dashed rounded-xl text-muted-foreground text-sm">
                    No agent found
                </div>
            )}
        </div>
    );
};

export const AgentsViewLoading = () => {
    return (
        <LoadingState title="Loading Agents" description="This may take few minutes" />
    );
};