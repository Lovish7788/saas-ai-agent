"use client";

/**
 * @file src/modules/meetings/ui/components/meeting-form.tsx
 * @description Form component for creating and editing meetings, using type-safe trpc hooks.
 */

import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { trpc } from "@/trpc/client"; // Use standard trpc client proxy hook
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CommandSelect } from "@/components/comand-select";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { MeetingGetOne } from "../../types";
import { meetingInsertSchema as meetingsInsertSchema } from "../../schema"; // Removed .ts extension
import { NewAgentDialog } from "@/modules/agents/ui/components/new-agent-dialog";

interface MeetingFormProps {
  onSuccess?: (id?: string) => void;
  onCancel?: () => void;
  initialValues?: MeetingGetOne;
}

export const MeetingForm = ({
  onSuccess,
  onCancel,
  initialValues,
}: MeetingFormProps) => {
  const router = useRouter();
  const utils = trpc.useUtils(); // Use trpc context utilities

  const [openNewAgentDialog, setOpenNewAgentDialog] = useState(false);

  // 1. Fetch all available agents list on mount (client-side filtering handles search queries)
  const { data: agentsData, isLoading: isLoadingAgents } = trpc.agents.getMany.useQuery({
    pageSize: 100
  });
  const agentsList = agentsData?.items ?? [];

  // 2. Setup client-side tRPC mutation hooks
  const createMeeting = trpc.meetings.create.useMutation({
    onSuccess: async (data) => {
      toast.success("Meeting created successfully!");
      utils.meetings.getMany.invalidate();
      utils.premium.getFreeUsage.invalidate();
      onSuccess?.(data.id);
    },
    onError: (error) => {
      toast.error(error.message);
      if (error.data?.code === "FORBIDDEN") {
        router.push("/upgrade");
      }
    },
  });

  const updateMeeting = trpc.meetings.update.useMutation({
    onSuccess: async (data) => {
      toast.success("Meeting updated successfully!");
      utils.meetings.getMany.invalidate();
      if (initialValues?.id) {
        utils.meetings.getOne.invalidate({ id: initialValues.id });
      }
      onSuccess?.(data.id);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const form = useForm<z.infer<typeof meetingsInsertSchema>>({
    resolver: zodResolver(meetingsInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      agentId: initialValues?.agentId ?? "",
    },
  });

  const isEdit = !!initialValues?.id;
  const isPending = createMeeting.isPending || updateMeeting.isPending;

  const onSubmit = (values: z.infer<typeof meetingsInsertSchema>) => {
    if (isEdit && initialValues?.id) {
      updateMeeting.mutate({ ...values, id: initialValues.id });
    } else {
      createMeeting.mutate(values);
    }
  };

  return (
    <>
      <NewAgentDialog open={openNewAgentDialog} onOpenChange={setOpenNewAgentDialog} />
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. Math Consultations" disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="agentId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agent</FormLabel>
                <FormControl>
                  <CommandSelect
                    options={agentsList.map((agent) => ({
                      id: agent.id,
                      value: agent.id,
                      children: (
                        <div className="flex items-center gap-x-2">
                          <GeneratedAvatar
                            seed={agent.name}
                            variant="bottsNeutral"
                            className="border size-6"
                          />
                          <span>{agent.name}</span>
                        </div>
                      )
                    }))}
                    onSelect={field.onChange}
                    // Omitted onSearch: forces CommandSelect component to run client-side filtering (shouldFilter=true)
                    // This is much faster, instant, and 100% reliable since agents list has limit 100.
                    value={field.value}
                    placeholder="Select an agent"
                  />
                </FormControl>
                <FormDescription>
                  Not found what you&apos;re looking for?{" "}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => setOpenNewAgentDialog(true)}
                    disabled={isPending}
                  >
                    Create new agent
                  </button>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between gap-x-2 pt-4 border-t">
            {onCancel && (
              <Button
                variant="ghost"
                disabled={isPending}
                type="button"
                onClick={() => onCancel()}
              >
                Cancel
              </Button>
            )}
            <Button disabled={isPending} type="submit" className="flex items-center gap-x-2">
              {isPending && <Loader2 className="size-4 animate-spin" />}
              {isEdit ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};