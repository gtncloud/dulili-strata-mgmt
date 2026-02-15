
"use client";

import { useActionState } from "react";
import { createMaintenanceRequest } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export function MaintenanceForm() {
    const [state, formAction, isPending] = useActionState(createMaintenanceRequest, undefined);

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>New Maintenance Request</CardTitle>
                <CardDescription>Report an issue in the building</CardDescription>
            </CardHeader>
            <form action={formAction}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" placeholder="e.g. Leaking tap in laundry" required />
                        {state?.errors && 'title' in state.errors && <p className="text-sm text-red-500">{state.errors.title}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <select
                            id="category"
                            name="category"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                            required
                        >
                            <option value="plumbing">Plumbing</option>
                            <option value="electrical">Electrical</option>
                            <option value="structural">Structural</option>
                            <option value="cosmetic">Cosmetic</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <select
                            id="priority"
                            name="priority"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                            required
                        >
                            <option value="low">Low - Hasn't caused damage yet</option>
                            <option value="medium">Medium - Needs fixing this week</option>
                            <option value="high">High - Causing damage/safety issue</option>
                            <option value="urgent">Urgent - Emergency (Fire/Flood/Danger)</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location">Location (Optional)</Label>
                        <Input id="location" name="location" placeholder="e.g. Unit 101 Kitchen or B1 Carpark" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            name="description"
                            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Describe the issue in detail..."
                            required
                        />
                        {state?.errors && 'description' in state.errors && <p className="text-sm text-red-500">{state.errors.description}</p>}
                    </div>

                    {state?.errors && 'form' in state.errors && (
                        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                            {state.errors.form}
                        </div>
                    )}

                </CardContent>
                <CardFooter className="flex justify-between">
                    <Link href="/dashboard/maintenance">
                        <Button variant="outline" type="button">Cancel</Button>
                    </Link>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Submitting..." : "Submit Request"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
