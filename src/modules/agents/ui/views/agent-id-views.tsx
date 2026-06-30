"use client";

/**
 * @file src/modules/agents/ui/views/agent-id-views.tsx
 * @description Single Agent Details view component utilizing Breadcrumbs and Action Dropdown Menu.
 */

import { trpc } from "@/trpc/client";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon, Edit3Icon, TrashIcon, BotIcon, VideoIcon, UserIcon, FileTextIcon } from "lucide-react";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface Props {
    agentId: string;
}

export const AgentIdView = ({ agentId }: Props) => {
    // 1. Fetch single agent (returns agent info along with owner username)
    const [agent] = trpc.agents.getOne.useSuspenseQuery({ id: agentId });

    if (!agent) {
        return (
            <div className="p-8 text-center text-muted-foreground">
                Agent not found.
            </div>
        );
    }

    return (
        <div className="flex-1 py-6 px-4 md:px-8 flex flex-col gap-y-6 max-w-4xl mx-auto">
            {/* Breadcrumb section */}
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/">Home</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/agents">Agents</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="capitalize">{agent.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Header profile details block */}
            <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-x-3">
                    <GeneratedAvatar
                        seed={agent.name}
                        variant="bottsNeutral"
                        className="size-12 border rounded-full bg-muted"
                    />
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight capitalize">{agent.name}</h1>
                        <p className="text-xs text-muted-foreground flex items-center gap-x-1 mt-0.5">
                            <UserIcon className="size-3" />
                            Created by <span className="font-medium text-foreground">{agent.username}</span>
                        </p>
                    </div>
                </div>

                {/* Dropdown Menu actions */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                            <MoreHorizontalIcon className="size-4" />
                            <span className="sr-only">Open actions</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer flex items-center gap-x-2">
                            <Edit3Icon className="size-4 text-muted-foreground" />
                            Edit Agent
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive flex items-center gap-x-2">
                            <TrashIcon className="size-4" />
                            Delete Agent
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Content Details for Agent */}
            <div className="space-y-6">
                {/* Meetings Badge display */}
                <div className="flex items-center gap-x-4 bg-muted/40 p-4 rounded-xl border">
                    <div className="p-2 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-lg">
                        <VideoIcon className="size-5" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold">Total Meetings</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{agent.meetingCount} meetings scheduled</p>
                    </div>
                </div>

                {/* Instructions section */}
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold flex items-center gap-x-2 text-foreground">
                        <FileTextIcon className="size-4 text-muted-foreground" />
                        Instructions
                    </h3>
                    <div className="text-sm leading-relaxed text-muted-foreground bg-card p-5 rounded-xl border whitespace-pre-wrap shadow-sm">
                        {agent.instructions}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const AgentIdViewLoading = () => {
    return (
        <LoadingState title="Loading agent details" description="This may take few seconds" />
    );
};

export const AgentIdViewError = () => {
    return (
        <ErrorState title="Error in loading agent" description="Something went wrong while fetching details" />
    );
};