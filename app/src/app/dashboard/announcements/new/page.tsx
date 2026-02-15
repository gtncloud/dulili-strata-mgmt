"use client";

import { useState, useActionState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2, Pin, Users, Building2, UserCheck } from "lucide-react";
import Link from "next/link";
import { createAnnouncement } from "../actions";

type FormState = {
    errors?: {
        title?: string[];
        content?: string[];
    };
    error?: string;
} | undefined;

export default function NewAnnouncementPage() {
    const router = useRouter();
    const [state, formAction, isPending] = useActionState<FormState, FormData>(createAnnouncement, undefined);
    const [selectedAudience, setSelectedAudience] = useState("all");
    const [isPinned, setIsPinned] = useState(false);

    const audiences = [
        { value: "all", label: "All Residents", icon: Building2, color: "bg-indigo-100 text-indigo-700 border-indigo-300", description: "Everyone in the building" },
        { value: "owners", label: "Owners Only", icon: UserCheck, color: "bg-emerald-100 text-emerald-700 border-emerald-300", description: "Property owners" },
        { value: "tenants", label: "Tenants Only", icon: Users, color: "bg-blue-100 text-blue-700 border-blue-300", description: "Rental tenants" },
        { value: "committee", label: "Committee", icon: Users, color: "bg-amber-100 text-amber-700 border-amber-300", description: "Committee members only" },
    ];

    return (
        <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/announcements">
                    <Button variant="ghost" size="sm" className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">New Announcement</h1>
                    <p className="text-slate-600 mt-1">Share news and updates with your building community</p>
                </div>
            </div>

            {/* Form */}
            <form action={formAction}>
                <Card className="shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
                        <CardTitle>Announcement Details</CardTitle>
                        <CardDescription>
                            Create a clear and informative announcement for residents
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-slate-700 font-medium">
                                Title <span className="text-rose-500">*</span>
                            </Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="e.g., Building Maintenance Scheduled for Next Week"
                                required
                                className="h-11"
                            />
                            {state?.errors?.title && (
                                <p className="text-sm text-rose-600">{state.errors.title}</p>
                            )}
                            <p className="text-xs text-slate-500">
                                Clear, descriptive title that summarizes the announcement
                            </p>
                        </div>

                        {/* Content */}
                        <div className="space-y-2">
                            <Label htmlFor="content" className="text-slate-700 font-medium">
                                Content <span className="text-rose-500">*</span>
                            </Label>
                            <Textarea
                                id="content"
                                name="content"
                                placeholder="Write your announcement here. Include all relevant details, dates, and any actions residents need to take..."
                                required
                                rows={10}
                                className="resize-none"
                            />
                            {state?.errors?.content && (
                                <p className="text-sm text-rose-600">{state.errors.content}</p>
                            )}
                            <p className="text-xs text-slate-500">
                                Minimum 20 characters. Be clear and provide all necessary information.
                            </p>
                        </div>

                        {/* Target Audience */}
                        <div className="space-y-3">
                            <Label className="text-slate-700 font-medium">
                                Target Audience <span className="text-rose-500">*</span>
                            </Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {audiences.map((audience) => {
                                    const Icon = audience.icon;
                                    return (
                                        <label
                                            key={audience.value}
                                            className={`
                                                relative flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all
                                                ${selectedAudience === audience.value
                                                    ? `${audience.color} border-current shadow-md`
                                                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                                }
                                            `}
                                        >
                                            <input
                                                type="radio"
                                                name="targetAudience"
                                                value={audience.value}
                                                checked={selectedAudience === audience.value}
                                                onChange={(e) => setSelectedAudience(e.target.value)}
                                                className="sr-only"
                                                required
                                            />
                                            <Icon className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                                            <div className="flex-1">
                                                <span className="text-sm font-medium block">{audience.label}</span>
                                                <span className="text-xs text-slate-600 mt-1 block">{audience.description}</span>
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Pin Option */}
                        <div className="space-y-3">
                            <Label className="text-slate-700 font-medium">
                                Display Options
                            </Label>
                            <label className={`
                                flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all
                                ${isPinned
                                    ? "bg-amber-50 text-amber-700 border-amber-300 shadow-md"
                                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                }
                            `}>
                                <input
                                    type="checkbox"
                                    name="isPinned"
                                    checked={isPinned}
                                    onChange={(e) => setIsPinned(e.target.checked)}
                                    className="sr-only"
                                />
                                <Pin className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                    <span className="text-sm font-medium block">Pin this announcement</span>
                                    <span className="text-xs text-slate-600 mt-1 block">
                                        Pinned announcements appear at the top and are highlighted for visibility
                                    </span>
                                </div>
                            </label>
                        </div>

                        {/* Australian Compliance Note */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex gap-3">
                                <div className="text-2xl">📋</div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-blue-900 mb-1">Notice Board Compliance</h4>
                                    <p className="text-sm text-blue-800">
                                        All announcements are maintained in accordance with NSW Strata Schemes Management Act 2015, 
                                        Section 143 (Notice Board Requirements). Important notices will be archived for compliance records.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Error Message */}
                        {state?.error && (
                            <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
                                <p className="text-sm text-rose-800">{state.error}</p>
                            </div>
                        )}


                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                    <Link href="/dashboard/announcements" className="flex-1">
                        <Button type="button" variant="outline" className="w-full h-11" disabled={isPending}>
                            Cancel
                        </Button>
                    </Link>
                    <Button
                        type="submit"
                        className="flex-1 h-11 bg-gradient-primary hover:opacity-90 transition-opacity"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Publishing...
                            </>
                        ) : (
                            "Publish Announcement"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
