"use client";
import { Button } from "@/components/ui/button";
import { PanelLeftIcon, PanelRightIcon, SearchIcon, SearchXIcon } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { DashboardComand } from "./dashboard-comand";
import { useEffect, useState } from "react";
export const DashboardNavbar = () => {
    const { state, toggleSidebar, isMobile } = useSidebar();
    const [commandOpen, setCommandOpen] = useState(false)

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setCommandOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () =>
            document.removeEventListener("keydown", down);
    }, [])
    return (
        <>
            <DashboardComand open={commandOpen} setOpen={setCommandOpen} />
            <nav className="flex px-4 gap-x-2 items-center bg-background">
                <Button className="size-9" variant="outline" onClick={toggleSidebar}>
                    {(state === "collapsed" || isMobile)
                        ? <PanelLeftIcon className="size-4" /> : <PanelRightIcon className="size-4" />}
                </Button>

                <Button
                    className="h-9 w-[240px] justify-start font-normal text-muted-foreground
            hover:text-muted-foreground hover:cursor-pointer"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        setCommandOpen((open) => !open)
                    }}
                >
                    <SearchIcon />
                    Search
                    <kbd className="pointer-events-none flex h-5 shrink-0 select-none items-center gap-1 rounded border bg-muted font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                        <span className="text-xs font-medium text-muted-foreground">&#8984;</span>
                    </kbd>
                </Button>
            </nav>
        </>
    );
}