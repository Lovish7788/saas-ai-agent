"use client";

/**
 * @file src/modules/agents/ui/views/agents-view.tsx
 * @description Agents View Component with controlled state responsive dialog and create form.
 */

import { trpc } from "@/trpc/client";
import { LoadingState } from "@/components/loading-state";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PlusIcon, BotIcon, FileTextIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
    Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// Define the schema matching our backend requirements
const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    instructions: z.string().min(1, "Instructions are required"),
});

export const AgentsView = () => {
    // 1. Fetch agents data using React Suspense
    const [agentsList] = trpc.agents.getMany.useSuspenseQuery();

    // 2. Control the open/close state of the responsive dialog
    const [isOpen, setIsOpen] = useState(false);

    // 3. Get query client utilities for cache invalidation
    const utils = trpc.useUtils();

    // 4. Set up react-hook-form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            instructions: "",
        }
    });

    // 5. Setup create mutation hook
    const createMutation = trpc.agents.create.useMutation({
        onSuccess: () => {
            toast.success("Agent created successfully!");
            setIsOpen(false);
            form.reset();
            // Invalidate getMany query to automatically refetch and reload the page list
            utils.agents.getMany.invalidate();
        },
        onError: (error) => {
            toast.error(error.message || "Failed to create agent");
        }
    });

    // 6. Handle Form Submit
    const onSubmit = (values: z.infer<typeof formSchema>) => {
        createMutation.mutate(values);
    };

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
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Agent Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="E.g. Customer Support" {...field} disabled={createMutation.isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="instructions"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Instructions</FormLabel>
                                    <FormControl>
                                        <Textarea 
                                            placeholder="Define agent persona, instructions, and rules of engagement..." 
                                            className="min-h-[100px]"
                                            disabled={createMutation.isPending}
                                            {...field} 
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end gap-x-2 pt-4 border-t">
                            <Button 
                                type="button"
                                variant="outline" 
                                onClick={() => setIsOpen(false)}
                                disabled={createMutation.isPending}
                                className="cursor-pointer"
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit"
                                disabled={createMutation.isPending}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                            >
                                {createMutation.isPending ? "Creating..." : "Save Agent"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </ResponsiveDialog>
        </div>
    );
};

export const AgentsViewLoading = () => {
    return (
        <LoadingState title="Loading Agents" description="This may take few minutes" />
    );
};