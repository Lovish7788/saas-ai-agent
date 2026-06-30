"use client";

/**
 * @file src/modules/agents/ui/views/agents-view.tsx
 * @description Agents View Component rendering the DataTable lists or EmptyState.
 */

import { trpc } from "@/trpc/client";
import { LoadingState } from "@/components/loading-state";
import { EmptyState } from "@/components/empty-state";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { AgentForm } from "../components/agent-form";
import { DataTable } from "../components/data-table";
import { columns } from "../components/colums";

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

            {/* Display the DataTable if agents exist, otherwise show EmptyState */}
            {agentsList && agentsList.length > 0 ? (
                <DataTable columns={columns} data={agentsList} />
            ) : (
                <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed rounded-xl bg-card shadow-inner gap-y-4">
                    <EmptyState
                        title="No agent found"
                        description="You don't have any configured AI agents yet. Click the button below to build your first assistant."
                    />
                    <Button
                        onClick={() => setIsOpen(true)}
                        className="bg-primary text-primary-foreground cursor-pointer flex items-center gap-x-2 mt-4"
                    >
                        <PlusIcon className="size-4" />
                        Create your first agent
                    </Button>
                </div>
            )}

            {/* Controlled Responsive Dialog */}
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