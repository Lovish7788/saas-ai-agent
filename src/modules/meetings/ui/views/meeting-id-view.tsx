"use client";

/**
 * @file src/modules/meetings/ui/views/meeting-id-view.tsx
 * @description Detail page view for a single meeting session, displaying summaries, transcripts and recording status.
 */

import { trpc } from "@/trpc/client";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { EmptyState } from "@/components/empty-state"; // Import EmptyState
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import humanizeDuration from "humanize-duration";
import { 
  ArrowLeftIcon, 
  CalendarIcon, 
  ClockIcon, 
  MessageSquareIcon, 
  PlayIcon, 
  BotIcon, 
  FileTextIcon, 
  VideoIcon,
  ClockArrowUpIcon,
  CircleCheckIcon,
  CircleXIcon,
  Loader2Icon
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MeetingIdViewProps {
  meetingId: string;
}

const statusIconMap = {
  scheduled: ClockArrowUpIcon,
  active: Loader2Icon,
  completed: CircleCheckIcon,
  processing: Loader2Icon,
  cancelled: CircleXIcon,
};

function formatDuration(seconds: number) {
  return humanizeDuration(seconds * 1000, {
    largest: 1,
    round: true,
    units: ["h", "m", "s"],
  });
}

export const MeetingIdView = ({ meetingId }: MeetingIdViewProps) => {
  const router = useRouter();

  // 1. Fetch single meeting details using suspense query
  const [data] = trpc.meetings.getOne.useSuspenseQuery({ id: meetingId });

  // Render a clean EmptyState graphic instead of an ErrorState when meeting record is missing
  if (!data) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 mt-16 gap-y-4">
        <EmptyState 
          title="Meeting Not Found" 
          description="The meeting you are looking for does not exist or you don't have access to it." 
        />
        <Button onClick={() => router.push("/meetings")} className="cursor-pointer">
          Back to Meetings
        </Button>
      </div>
    );
  }

  const status = data.status;
  const StatusIcon = statusIconMap[status] || ClockArrowUpIcon;

  // Calculate duration
  let durationSeconds = 0;
  if (data.startedAt && data.endedAt) {
    durationSeconds = Math.max(0, Math.floor((new Date(data.endedAt).getTime() - new Date(data.startedAt).getTime()) / 1000));
  }

  return (
    <div className="flex-1 py-6 px-4 md:px-8 flex flex-col gap-y-6 max-w-7xl mx-auto w-full">
      {/* Header Navigation */}
      <div className="flex flex-col gap-y-2 md:flex-row md:items-center md:justify-between md:gap-y-0 border-b pb-4">
        <div className="flex items-center gap-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push("/meetings")}
            className="cursor-pointer flex items-center gap-x-2"
          >
            <ArrowLeftIcon className="size-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight capitalize">{data.name}</h1>
            <p className="text-sm text-muted-foreground">
              Created on {format(new Date(data.createdAt), "PPP")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-x-3 self-start md:self-auto">
          <Badge
            variant={
              status === "completed"
                ? "default"
                : status === "cancelled"
                ? "destructive"
                : "secondary"
            }
            className="flex items-center gap-x-2 py-1 px-3 capitalize font-semibold"
          >
            <StatusIcon className={cn("size-3.5", status === "active" || status === "processing" ? "animate-spin" : "")} />
            {status}
          </Badge>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Summary & Transcript (2 cols wide) */}
        <div className="lg:col-span-2 flex flex-col gap-y-6">
          
          {/* Summary Section */}
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center gap-x-3">
              <FileTextIcon className="size-5 text-emerald-600" />
              <div>
                <CardTitle className="text-lg">AI Summary</CardTitle>
                <CardDescription>Key takeaways and highlights extracted by your assistant</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {data.summary ? (
                <div className="text-sm leading-relaxed text-foreground bg-muted/40 p-4 rounded-lg border">
                  {data.summary}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 bg-muted/20 border border-dashed rounded-lg text-center text-muted-foreground gap-y-2">
                  <FileTextIcon className="size-8 stroke-[1.5] text-muted-foreground/60" />
                  <p className="text-sm font-medium">No Summary Available</p>
                  <p className="text-xs max-w-[280px]">
                    Once the meeting completes, the AI assistant will generate a summary of the conversation here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Transcript Section */}
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center gap-x-3">
              <MessageSquareIcon className="size-5 text-blue-600" />
              <div>
                <CardTitle className="text-lg">Transcript</CardTitle>
                <CardDescription>Full transcript of the conversation</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {data.transcriptUrl ? (
                <div className="bg-muted/30 p-4 rounded-lg border max-h-[400px] overflow-y-auto text-sm leading-relaxed">
                  {/* Mocking transcript content or loading text */}
                  <p className="text-muted-foreground italic">Full transcript is ready and loaded from storage.</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 bg-muted/20 border border-dashed rounded-lg text-center text-muted-foreground gap-y-2">
                  <MessageSquareIcon className="size-8 stroke-[1.5] text-muted-foreground/60" />
                  <p className="text-sm font-medium">No Transcript Yet</p>
                  <p className="text-xs max-w-[280px]">
                    Transcripts will appear here in real-time once the meeting is activated and processed.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

        </div>

        {/* Right Side: Agent Info & Call Metadata (1 col wide) */}
        <div className="flex flex-col gap-y-6">

          {/* AI Agent Info */}
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center gap-x-3 pb-3">
              <BotIcon className="size-5 text-purple-600" />
              <CardTitle className="text-base font-semibold">Running Agent</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-x-3 bg-muted/30 p-3 rounded-lg border">
                <GeneratedAvatar
                  variant="bottsNeutral"
                  seed={data.agentName}
                  className="size-10 rounded-md border"
                />
                <div>
                  <h4 className="font-semibold text-sm capitalize">{data.agentName}</h4>
                  <p className="text-xs text-muted-foreground">Virtual Host</p>
                </div>
              </div>
              <div>
                <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  System Instructions
                </h5>
                <p className="text-xs leading-relaxed text-foreground bg-muted/40 p-3 rounded-md border max-h-[150px] overflow-y-auto">
                  {data.agentInstructions}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Recording Player */}
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center gap-x-3 pb-3">
              <VideoIcon className="size-5 text-red-600" />
              <CardTitle className="text-base font-semibold">Recording</CardTitle>
            </CardHeader>
            <CardContent>
              {data.recordingUrl ? (
                <div className="flex flex-col gap-y-3">
                  <div className="aspect-video bg-black rounded-lg flex items-center justify-center relative overflow-hidden border">
                    <Button size="icon" className="rounded-full size-12 bg-white/20 hover:bg-white/30 backdrop-blur-xs text-white">
                      <PlayIcon className="size-6 fill-white" />
                    </Button>
                  </div>
                  <Button variant="outline" size="sm" className="w-full text-xs cursor-pointer">
                    Download Recording
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 bg-muted/20 border border-dashed rounded-lg text-center text-muted-foreground gap-y-2">
                  <VideoIcon className="size-7 stroke-[1.5] text-muted-foreground/60" />
                  <p className="text-sm font-medium">Recording Unavailable</p>
                  <p className="text-xs">
                    This meeting hasn&apos;t been recorded or is currently processing.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Session Metadata */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-sm font-semibold">Session Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Start Time</span>
                <span className="font-medium">
                  {data.startedAt ? format(new Date(data.startedAt), "p") : "Not Started"}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">End Time</span>
                <span className="font-medium">
                  {data.endedAt ? format(new Date(data.endedAt), "p") : "Pending"}
                </span>
              </div>
              <div className="flex justify-between text-xs border-t pt-3">
                <span className="text-muted-foreground">Total Duration</span>
                <span className="font-semibold text-primary">
                  {durationSeconds ? formatDuration(durationSeconds) : "0s"}
                </span>
              </div>
            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
};

// Loading fallback component
export const MeetingIdViewLoading = () => {
  return (
    <LoadingState 
      title="Loading Meeting Details" 
      description="Parsing summaries and transcripts, please wait..." 
    />
  );
};

// Error fallback component
export const MeetingIdViewError = () => {
  return (
    <ErrorState 
      title="Error Loading Meeting" 
      description="Failed to load meeting details from the server." 
    />
  );
};
