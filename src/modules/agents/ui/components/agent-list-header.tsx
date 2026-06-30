"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusIcon, XCircleIcon } from "lucide-react"
import { NewAgentDialog } from "./new-agent-dialog"
import { useAgentsFilters } from "../../hooks/use-agents-filter"
import { DEFAULT_PAGE } from "@/constants"
import { AgentSearchFilter } from "./agent-search-filter"
export const AgentListHeader = () => {
    const [filters, setFilters] = useAgentsFilters();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const isAnyFilterModified = !!filters.search
    const onClearFilters = () => {
        setFilters({
            search: "",
            page: DEFAULT_PAGE
        })
    }

    return (
        <>
            <NewAgentDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
            <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
                <div className="flex items-center justify-between">
                    <h5>My Agents</h5>
                    <Button onClick={() => setIsDialogOpen(true)}>
                        <PlusIcon />
                        New Agent

                    </Button>
                </div>
                <div className="flex items-center justify-between">

                    <AgentSearchFilter />
                    {isAnyFilterModified && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onClearFilters}>
                            <XCircleIcon />
                            Clear Filters
                        </Button>
                    )}
                </div>

            </div>
        </>
    )
}