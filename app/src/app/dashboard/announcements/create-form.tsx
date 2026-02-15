
"use client";

import { useActionState } from "react";
import { createAnnouncement } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export function AnnouncementForm() {
    const [state, formAction, isPending] = useActionState(createAnnouncement, undefined);

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Post Announcement</CardTitle>
                <CardDescription>Share updates with the building community</CardDescription>
            </CardHeader>
            <form action={formAction}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" placeholder="e.g. Window Cleaning Schedule" required />
                        {state?.errors?.title && <p className="text-sm text-red-500">{state.errors.title}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="targetAudience">Target Audience</Label>
                        <select
                            id="targetAudience"
                            name="targetAudience"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                            required
                        >
                            <option value="all">Everyone</option>
                            <option value="owners">Owners Only</option>
                            <option value="tenants">Tenants Only</option>
                            <option value="committee">Committee Only</option>
                        </select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="isPinned"
                            name="isPinned"
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <Label htmlFor="isPinned">Pin directly to top</Label>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content">Content</Label>
                        <textarea
                            id="content"
                            name="content"
                            className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Write your announcement here..."
                            required
                        />
                        {state?.errors?.content && <p className="text-sm text-red-500">{state.errors.content}</p>}
                    </div>

                    {state?.errors?.form && (
                        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                            {state.errors.form}
                        </div>
                    )}

                </CardContent>
                <CardFooter className="flex justify-between">
                    <Link href="/dashboard/announcements">
                        <Button variant="outline" type="button">Cancel</Button>
                    </Link>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Posting..." : "Post Announcement"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
