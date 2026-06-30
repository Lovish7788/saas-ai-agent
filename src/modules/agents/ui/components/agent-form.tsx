"use client"

/**
 * @file src/modules/agents/ui/components/agent-form.tsx
 * @description Reusable Agent Form component for creating and editing AI agents.
 */

import { z } from "zod";
import { AgentGetOne } from "../../types";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { agentInsertSchema } from "@/modules/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
    FormField,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";

interface AgentFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    initialValues?: AgentGetOne;
}

export const AgentForm = ({
    onSuccess,
    onCancel,
    initialValues
}: AgentFormProps) => {
    const router = useRouter();
    const utils = trpc.useUtils();

    // 1. Setup client-side tRPC mutation hook
    const createAgent = trpc.agents.create.useMutation({
        onSuccess: () => {
            toast.success("Agent created successfully!");
            form.reset();
            // Invalidate getMany query to refresh the agents dashboard list
            utils.agents.getMany.invalidate();
            onSuccess?.();
        },
        onError: (error) => {
            toast.error(error.message || "Something went wrong");
        }
    });

    // 2. Initialize react-hook-form with default values
    const form = useForm<z.infer<typeof agentInsertSchema>>({
        resolver: zodResolver(agentInsertSchema),
        defaultValues: {
            name: initialValues?.name ?? "",
            instructions: initialValues?.instructions ?? ""
        },
    });

    const isEdit = !!initialValues?.id;
    const isPending = createAgent.isPending;

    // 3. Form submission callback
    const onSubmit = (values: z.infer<typeof agentInsertSchema>) => {
        if (isEdit) {
            console.log("TODO: UpdateAgent");
        } else {
            createAgent.mutate(values);
        }
    };

    return (
        <Form {...form}>
            <form className="space-y-4 pt-2" onSubmit={form.handleSubmit(onSubmit)}>
                {/* Dynamically generated avatar based on the typed name */}
                <div className="flex justify-center pb-2">
                    <GeneratedAvatar
                        seed={form.watch("name") || "agent"}
                        variant="bottsNeutral"
                        className="border size-16 rounded-full"
                    />
                </div>

                {/* Agent Name input */}
                <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="E.g. Customer Assistant"
                                    {...field}
                                    disabled={isPending}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Agent Instructions textarea */}
                <FormField
                    name="instructions"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Instructions</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Explain what the agent should do..."
                                    className="min-h-[120px]"
                                    {...field}
                                    disabled={isPending}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Cancel and Save triggers */}
                <div className="flex justify-end gap-x-2 pt-4 border-t">
                    {onCancel && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            disabled={isPending}
                            className="cursor-pointer"
                        >
                            Cancel
                        </Button>
                    )}
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                    >
                        {isPending ? "Saving..." : "Save Agent"}
                    </Button>
                </div>
            </form>
        </Form>
    );
};