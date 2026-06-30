"use client";

/**
 * @file src/modules/agents/ui/views/agents-view.tsx
 * @description Agents View Component rendering the lists grid and wrapping the AgentForm modal.
 */

import { trpc } from "@/trpc/client";
import { LoadingState } from "@/components/loading-state";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PlusIcon, BotIcon, FileTextIcon } from "lucide-react";
import { AgentForm } from "../components/agent-form";

export const AgentsView = () => {
    // 1. Fetch agents data using React Suspense
    const [agentsList] = trpc.agents.getMany.useSuspenseQuery();

    // 2. Control the open/close state of the responsive dialog
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="p-6 flex flex-col gap-y-6">
            {/* Header section with page title and Create trigger button */}
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">AI Agents</h1>
                    <p className="text-sm text-muted-foreground">Manage and configure your intelligent assistants</p>
                </div>
                <Button 
                    onClick={() => setIsOpen(true)}
                    className="bg-primary text-primary-foreground flex items-center gap-x-2 cursor-pointer"
                >
                    <PlusIcon className="size-4" />
                    Create Agent
                </Button>
            </div>

            {/* Grid display of existing agents */}
            {agentsList && agentsList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {agentsList.map((agent) => (
                        <div key={agent.id} className="p-5 border rounded-xl bg-card text-card-foreground shadow-sm flex flex-col gap-y-3">
                            <div className="flex items-center gap-x-3">
                                <div className="p-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-lg">
                                    <BotIcon className="size-5" />
                                </div>
                                <h2 className="font-semibold text-base tracking-tight">{agent.name}</h2>
                            </div>
                            <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg flex gap-x-2">
                                <FileTextIcon className="size-4 shrink-0 mt-0.5" />
                                <div className="line-clamp-3">
                                    <strong>Instructions:</strong> {agent.instructions}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center p-12 border border-dashed rounded-xl text-muted-foreground text-sm flex flex-col items-center justify-center gap-y-3">
                    <BotIcon className="size-8 text-muted-foreground/60" />
                    <p>No agent found</p>
                    <Button 
                        variant="outline"
                        onClick={() => setIsOpen(true)}
                        className="cursor-pointer text-xs"
                    >
                        Create your first agent
                    </Button>
                </div>
            )}

            {/* Controlled Responsive Dialog (dialog on desktop, drawer on mobile) */}
            <ResponsiveDialog
                title="Create New Agent"
                description="Configure your new AI agent instructions and details here."
                open={isOpen}
                onOpenChange={setIsOpen}
            >
                {/* Reusable form component with handlers */}
                <AgentForm 
                    onSuccess={() => setIsOpen(false)} 
                    onCancel={() => setIsOpen(false)} 
                />
            </ResponsiveDialog>
        </div>
    );
};

export const AgentsViewLoading = () => {
    return (
        <LoadingState title="Loading Agents" description="This may take few minutes" />
    );
};