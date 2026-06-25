// Styling Utility functions
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Helper function to safely merge Tailwind CSS classes with dynamic conditions using clsx and twMerge.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
