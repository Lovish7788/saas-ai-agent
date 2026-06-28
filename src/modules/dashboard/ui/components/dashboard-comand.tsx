"use client"

/**
 * @file src/modules/dashboard/ui/components/dashboard-comand.tsx
 * @description Dashboard Command Palette Search Dialog component
 */

import {
    Command,
    CommandResponsiveDialog, // Using the responsive variant for automatic desktop/mobile layout switching
    CommandInput,
    CommandItem,
    CommandList
} from "@/components/ui/command";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

interface Props {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export const DashboardComand = ({ open, setOpen }: Props) => {
    return (
        <CommandResponsiveDialog
            open={open}
            onOpenChange={setOpen}
            // Disables the backdrop blur overlay on search open
            overlayClassName="supports-backdrop-filter:backdrop-filter-none supports-backdrop-filter:backdrop-blur-none backdrop-blur-none backdrop-filter-none"
        >
            <Command>
                <CommandInput
                    placeholder="Find a meeting or agent"
                />

                <CommandList>
                    <CommandItem
                        onSelect={() => {
                            toast.success("Command Selected! (Action logic will be implemented here later)");
                            setOpen(false);
                        }}
                    >
                        Test
                    </CommandItem>
                </CommandList>
            </Command>
        </CommandResponsiveDialog>
    )
}