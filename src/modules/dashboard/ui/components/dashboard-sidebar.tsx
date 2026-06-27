"use client";
/**
 * @file src/modules/dashboard/ui/components/dashboard-sidebar.tsx
 * @description Dashboard Sidebar Navigation Component
 * 
 * --- PLACEMENT INTERVIEW BRIEFING ---
 * 
 * 1. WHY `usePathname`?
 *    We use the `usePathname()` hook from `next/navigation` to detect which route the user is currently visiting. 
 *    By matching `pathname === item.href`, we can conditionally apply active styles (like a distinct background or font weight) 
 *    to highlight the current page in the sidebar, which is critical for good User Experience (UX).
 * 
 * 2. WHY `Link` FROM `next/link`?
 *    Next.js `<Link>` components override standard HTML `<a>` tags.
 *    - **Why?** It intercepts browser navigation to prevent full-page reloads. It also automatically prefetches the linked page's 
 *      JavaScript code in the background when the Link enters the viewport, making page transitions feel instant.
 * 
 * 3. WHY `cn` UTILITY (`clsx` + `tailwind-merge`)?
 *    Tailwind CSS is utility-first. Conflicting classes (e.g. `bg-red-500 bg-blue-500`) can resolve unpredictably in native CSS. 
 *    We use the custom `cn` helper (which bundles `clsx` and `tailwind-merge`) to conditionally apply classes (like active route states) 
 *    while ensuring that conflicting classes are cleanly merged (the last class always overrides the previous one).
 */

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BotIcon, StarIcon, VideoIcon } from "lucide-react";

import { Fragment } from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

import dynamic from "next/dynamic";
import { DashboardTrial } from "./dashboard-trial";

// Dynamically import DashboardUserButton with SSR disabled.
// Why? The component calls authClient.useSession(), which relies on client-side React hooks.
// During Next.js Server-Side Rendering (SSR), there is no active browser context, which triggers
// an 'Invalid hook call' error. Disabling SSR forces the component to render solely on the client.
const DashboardUserButton = dynamic(
    () => import("./dashboard-user-button").then((mod) => mod.DashboardUserButton),
    { ssr: false }
);

const firstSection = [
    {
        icon: VideoIcon,
        label: "Meetings",
        href: "/meetings",
    },
    {
        icon: BotIcon,
        label: "Agents",
        href: "/agents",
    },
];

const secondSection = [
    {
        icon: StarIcon,
        label: "Upgrade",
        href: "/upgrade",
    },
];

export const DashboardSidebar = () => {
    const pathname = usePathname();

    return (
        <Sidebar>
            <SidebarHeader className="text-sidebar-accent-foreground">
                <Link href="/" className="flex items-center gap-2 px-2 pt-2">
                    <Image src="/logo.svg" height={36} width={36} alt="Meet.AI" />
                    <p className="text-2xl font-semibold">Meet.AI</p>
                </Link>
            </SidebarHeader>
            <div className="px-4 py-2">
                <Separator className="opacity-10 text-[#5D6B68]" />
            </div>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-2">
                            {firstSection.map((item, index) => (
                                <Fragment key={item.href}>
                                    {index > 0 && (
                                        <div className="px-2">
                                            <div className="h-[1px] bg-sidebar-foreground/10 w-full" />
                                        </div>
                                    )}
                                    <SidebarMenuItem>
                                        <SidebarMenuButton
                                            asChild
                                            className={cn(
                                                "h-10 transition-colors duration-200",
                                                "hover:bg-sidebar-accent/50 hover:brightness-90", // Subtler hover + decrease brightness
                                                pathname === item.href && "bg-sidebar-accent text-sidebar-primary-foreground font-semibold" // Solid active state
                                            )}
                                            isActive={pathname === item.href}
                                        >
                                            <Link href={item.href}>
                                                <item.icon className="size-5" />
                                                <span className="text-sm font-medium tracking-tight">
                                                    {item.label}
                                                </span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </Fragment>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <div className="px-4 py-2">
                    <Separator className="opacity-10 text-[#5D6B68]" />
                </div>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-2">
                            {secondSection.map((item, index) => (
                                <Fragment key={item.href}>
                                    {index > 0 && (
                                        <div className="px-2">
                                            <div className="h-[1px] bg-sidebar-foreground/10 w-full" />
                                        </div>
                                    )}
                                    <SidebarMenuItem>
                                        <SidebarMenuButton
                                            asChild
                                            className={cn(
                                                "h-10 transition-colors duration-200",
                                                "hover:bg-sidebar-accent/50 hover:brightness-90", // Subtler hover + decrease brightness
                                                pathname === item.href && "bg-sidebar-accent text-sidebar-primary-foreground font-semibold" // Solid active state
                                            )}
                                            isActive={pathname === item.href}
                                        >
                                            <Link href={item.href}>
                                                <item.icon className="size-5" />
                                                <span className="text-sm font-medium tracking-tight">
                                                    {item.label}
                                                </span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </Fragment>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="text-white">
                <DashboardTrial />
                <DashboardUserButton />
            </SidebarFooter>
        </Sidebar>
    )
};