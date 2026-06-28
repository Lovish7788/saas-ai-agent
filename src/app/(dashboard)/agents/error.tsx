"use client";

/**
 * @file src/app/(dashboard)/agents/error.tsx
 * @description Next.js Route-level Error Boundary Component
 * 
 * --- PLACEMENT INTERVIEW BRIEFING ---
 * 
 * 1. WHY THE error.tsx CONVENTION?
 *    Next.js App Router uses file-system conventions. Creating an `error.tsx` file in a route segment 
 *    automatically wraps the corresponding `page.tsx` component in a React Error Boundary at runtime.
 *    - **Why?** If any component under `page.tsx` (like tRPC queries or rendering logic) throws a runtime exception, 
 *      Next.js catches it, prevents a full-page crash, and renders this component instead.
 * 
 * 2. THE `reset` FUNCTION:
 *    Next.js provides a `reset()` callback prop. Invoking it tells React to attempt to re-render the segment 
 *    (e.g., re-running the database fetch), allowing the user to recover from transient network errors 
 *    without reloading the entire webpage.
 */

import { ErrorState } from "@/components/error-state";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the caught exception for diagnostics
    console.error("Agents page error boundary caught:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center p-6 gap-y-4">
      <ErrorState
        title="Error in Loading Agents"
        description="Something went wrong while fetching your AI agents. Please check your database or connection."
      />
      
      {/* Recovery button allowing user to retry rendering */}
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:brightness-90 transition cursor-pointer"
      >
        Try again
      </button>
    </div>
  );
}