"use client"

/**
 * @file src/components/responsive-dialog.tsx
 * @description Responsive Dialog/Drawer Component for desktop and mobile layouts.
 */

import { useIsMobile } from "@/hooks/use-mobile";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";

interface ResponsiveDialogProps {
    title: string;
    description: string;
    children: React.ReactNode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const ResponsiveDialog = ({
    title,
    description,
    children,
    open,
    onOpenChange
}: ResponsiveDialogProps) => {
    const isMobile = useIsMobile();

    console.log("🔍 [ResponsiveDialog] state check:", { open, isMobile });

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={onOpenChange}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>{title}</DrawerTitle>
                        <DrawerDescription>{description}</DrawerDescription>
                    </DrawerHeader>
                    {/* Render children inside the mobile drawer layout */}
                    <div className="px-4 pb-4">{children}</div>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                {/* Render children inside the desktop dialog layout */}
                <div className="pt-4">{children}</div>
            </DialogContent>
        </Dialog>
    );
};
