"use client"

import {
    Command,
    CommandDialog,
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
        <CommandDialog
            open={open}
            onOpenChange={setOpen}
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
        </CommandDialog>
    )
}