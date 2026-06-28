import { AlertCircleIcon } from "lucide-react";

interface Props {
    title?: string;
    description: string;
}

export const ErrorState = ({ title = "Something went wrong", description }: Props) => {
    return (
        <div className="py-4 px-8 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-y-4 bg-background rounded-lg p-10 border border-destructive/20 shadow-sm max-w-sm text-center">
                {/* Visual warning icon with soft pulse animation to draw focus without being distracting */}
                <AlertCircleIcon className="size-8 text-destructive animate-pulse" />
                <h6 className="text-lg font-medium text-destructive">{title}</h6>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
        </div>
    );
};
