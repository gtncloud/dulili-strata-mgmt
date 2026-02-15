"use client";

import { useState, useActionState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { createMaintenanceRequest } from "./actions";

export default function NewMaintenanceRequestPage() {
    const router = useRouter();
    const [state, formAction, isPending] = useActionState(createMaintenanceRequest, undefined);
    const [selectedPriority, setSelectedPriority] = useState("medium");
    const [selectedCategory, setSelectedCategory] = useState("other");

    const priorities = [
        { value: "low", label: "Low", color: "bg-slate-100 text-slate-700 border-slate-300", emoji: "🟢" },
        { value: "medium", label: "Medium", color: "bg-blue-100 text-blue-700 border-blue-300", emoji: "🔵" },
        { value: "high", label: "High", color: "bg-orange-100 text-orange-700 border-orange-300", emoji: "🟠" },
        { value: "urgent", label: "Urgent", color: "bg-rose-100 text-rose-700 border-rose-300", emoji: "🔴" },
    ];

    const categories = [
        { value: "plumbing", label: "Plumbing", icon: "💧", description: "Leaks, pipes, drains" },
        { value: "electrical", label: "Electrical", icon: "⚡", description: "Lights, power, wiring" },
        { value: "structural", label: "Structural", icon: "🏗️", description: "Walls, floors, ceilings" },
        { value: "cosmetic", label: "Cosmetic", icon: "🎨", description: "Paint, fixtures, appearance" },
        { value: "other", label: "Other", icon: "🔧", description: "General maintenance" },
    ];

    return (
        <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/maintenance">
                    <Button variant="ghost" size="sm" className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">New Maintenance Request</h1>
                    <p className="text-slate-600 mt-1">Report a maintenance issue in your building</p>
                </div>
            </div>

            {/* Form */}
            <form action={formAction}>
                <Card className="shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b">
                        <CardTitle>Request Details</CardTitle>
                        <CardDescription>
                            Provide as much detail as possible to help us resolve the issue quickly
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-slate-700 font-medium">
                                Issue Title <span className="text-rose-500">*</span>
                            </Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="e.g., Leaking tap in Unit 402"
                                required
                                className="h-11"
                            />
                            {state?.errors?.title && (
                                <p className="text-sm text-rose-600">{state.errors.title}</p>
                            )}
                            <p className="text-xs text-slate-500">
                                Brief, descriptive title of the issue
                            </p>
                        </div>

                        {/* Category */}
                        <div className="space-y-3">
                            <Label className="text-slate-700 font-medium">
                                Category <span className="text-rose-500">*</span>
                            </Label>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                {categories.map((category) => (
                                    <label
                                        key={category.value}
                                        className={`
                                            relative flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-all
                                            ${selectedCategory === category.value
                                                ? "border-amber-500 bg-amber-50 shadow-md"
                                                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                            }
                                        `}
                                    >
                                        <input
                                            type="radio"
                                            name="category"
                                            value={category.value}
                                            checked={selectedCategory === category.value}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                            className="sr-only"
                                            required
                                        />
                                        <span className="text-3xl mb-2">{category.icon}</span>
                                        <span className="text-sm font-medium text-slate-900">{category.label}</span>
                                        <span className="text-xs text-slate-500 text-center mt-1">{category.description}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Priority */}
                        <div className="space-y-3">
                            <Label className="text-slate-700 font-medium">
                                Priority <span className="text-rose-500">*</span>
                            </Label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {priorities.map((priority) => (
                                    <label
                                        key={priority.value}
                                        className={`
                                            relative flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all
                                            ${selectedPriority === priority.value
                                                ? `${priority.color} border-current shadow-md font-semibold`
                                                : "border-slate-200 hover:border-slate-300 bg-white"
                                            }
                                        `}
                                    >
                                        <input
                                            type="radio"
                                            name="priority"
                                            value={priority.value}
                                            checked={selectedPriority === priority.value}
                                            onChange={(e) => setSelectedPriority(e.target.value)}
                                            className="sr-only"
                                            required
                                        />
                                        <span className="text-lg mr-2">{priority.emoji}</span>
                                        <span className="text-sm font-medium">{priority.label}</span>
                                    </label>
                                ))}
                            </div>
                            <p className="text-xs text-slate-500">
                                <strong>Urgent:</strong> Immediate safety risk or major damage
                            </p>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-slate-700 font-medium">
                                Description <span className="text-rose-500">*</span>
                            </Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Describe the issue in detail. Include when it started, what you've observed, and any relevant information..."
                                required
                                rows={6}
                                className="resize-none"
                            />
                            {state?.errors?.description && (
                                <p className="text-sm text-rose-600">{state.errors.description}</p>
                            )}
                            <p className="text-xs text-slate-500">
                                Minimum 10 characters. Be as specific as possible.
                            </p>
                        </div>

                        {/* Location */}
                        <div className="space-y-2">
                            <Label htmlFor="location" className="text-slate-700 font-medium">
                                Location
                            </Label>
                            <Input
                                id="location"
                                name="location"
                                placeholder="e.g., Unit 402, Bathroom"
                                className="h-11"
                            />
                            <p className="text-xs text-slate-500">
                                Specific location within the building (optional)
                            </p>
                        </div>

                        {/* Australian Compliance Note */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex gap-3">
                                <div className="text-2xl">ℹ️</div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-blue-900 mb-1">Australian Strata Compliance</h4>
                                    <p className="text-sm text-blue-800">
                                        All maintenance requests are logged in accordance with NSW Strata Schemes Management Act 2015. 
                                        Urgent safety issues will be prioritized as per Australian Building Codes.
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

                        {/* Success Message */}
                        {state?.success && (
                            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                                <p className="text-sm text-emerald-800">
                                    ✓ Request submitted successfully! Redirecting...
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                    <Link href="/dashboard/maintenance" className="flex-1">
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
                                Submitting...
                            </>
                        ) : (
                            "Submit Request"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
