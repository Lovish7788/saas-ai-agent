"use client";

import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { OctagonAlertIcon, CircleCheckIcon } from "lucide-react";

// The schema is simple: just an email is required to send the reset link
const formSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email." }),
});

export const ForgotPasswordView = () => {
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { email: "" },
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        setError(null);
        setPending(true);

        authClient.requestPasswordReset(
            {
                email: data.email,
                redirectTo: "/reset-password", // The page where they will enter the new password
            },
            {
                onSuccess: () => {
                    setPending(false);
                    setSuccess(true);
                },
                onError: ({ error }) => {
                    setPending(false);
                    setError(error.message);
                },
            }
        );
    };

    return (
        <div className="flex flex-col gap-6 max-w-md w-full mx-auto p-4">
            <Card className="p-6">

                <CardContent className="space-y-4">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold">Forgot Password</h1>
                        <p className="text-muted-foreground">Enter your email to receive a reset link.</p>
                    </div>

                    {success ? (
                        <Alert className="bg-emerald-500/10 border-none text-emerald-600">
                            <CircleCheckIcon className="h-4 w-4" />
                            <AlertTitle>Check your email for the reset link!</AlertTitle>
                        </Alert>
                    ) : (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField control={form.control} name="email" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="m@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                {!!error && (
                                    <Alert className="bg-destructive/10 border-none">
                                        <OctagonAlertIcon className="h-4 w-4 !text-destructive" />
                                        <AlertTitle>{error}</AlertTitle>
                                    </Alert>
                                )}

                                <Button disabled={pending} type="submit" className="w-full">
                                    {pending ? "Sending..." : "Send Reset Link"}
                                </Button>
                            </form>
                        </Form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};