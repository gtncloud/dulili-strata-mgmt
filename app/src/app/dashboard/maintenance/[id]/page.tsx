import { notFound, redirect } from "next/navigation";
import { verifySession } from "@/lib/session";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, User, MapPin, AlertCircle } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default async function MaintenanceDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await verifySession();
    if (!session?.isAuth) redirect("/auth/login");

    const { id } = await params;

    const request = await db.maintenanceRequest.findUnique({
        where: { id },
        include: {
            submittedBy: { select: { name: true, email: true } },
            assignedTo: { select: { name: true, email: true } },
            building: { select: { name: true } },
            photos: true,
        },
    });

    if (!request) notFound();

    const priorityConfig = {
        urgent: { color: "bg-rose-100 text-rose-700 border-rose-200", label: "Urgent" },
        high: { color: "bg-amber-100 text-amber-700 border-amber-200", label: "High" },
        medium: { color: "bg-blue-100 text-blue-700 border-blue-200", label: "Medium" },
        low: { color: "bg-slate-100 text-slate-700 border-slate-200", label: "Low" },
    };

    const statusConfig = {
        submitted: { color: "bg-blue-100 text-blue-700", label: "Submitted" },
        reviewed: { color: "bg-purple-100 text-purple-700", label: "Reviewed" },
        in_progress: { color: "bg-amber-100 text-amber-700", label: "In Progress" },
        resolved: { color: "bg-emerald-100 text-emerald-700", label: "Resolved" },
        closed: { color: "bg-slate-100 text-slate-700", label: "Closed" },
    };

    const priority = priorityConfig[request.priority as keyof typeof priorityConfig];
    const status = statusConfig[request.status as keyof typeof statusConfig];

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <Link href="/dashboard/maintenance">
                <Button variant="ghost" size="sm" className="mb-4">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Maintenance
                </Button>
            </Link>

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <div className="flex items-start justify-between mb-2">
                        <h1 className="text-2xl font-bold text-slate-900">{request.title}</h1>
                        <Badge className={`${status.color} border`}>{status.label}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {format(request.createdAt, "MMM d, yyyy 'at' h:mm a")}
                        </span>
                        <Badge className={`${priority.color} border`}>{priority.label}</Badge>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column - Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Description */}
                        <Card>
                            <CardContent className="pt-6">
                                <h3 className="text-sm font-semibold text-slate-900 mb-3">Description</h3>
                                <p className="text-sm text-slate-700 whitespace-pre-wrap">{request.description}</p>
                            </CardContent>
                        </Card>

                        {/* Photos */}
                        {request.photos.length > 0 && (
                            <Card>
                                <CardContent className="pt-6">
                                    <h3 className="text-sm font-semibold text-slate-900 mb-3">Photos</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {request.photos.map((photo) => (
                                            <a
                                                key={photo.id}
                                                href={photo.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 hover:opacity-90 transition-opacity"
                                            >
                                                <img
                                                    src={photo.url}
                                                    alt={photo.caption || "Maintenance photo"}
                                                    className="w-full h-full object-cover"
                                                />
                                                {photo.caption && (
                                                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2">
                                                        {photo.caption}
                                                    </div>
                                                )}
                                            </a>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Column - Metadata */}
                    <div className="space-y-4">
                        {/* Details Card */}
                        <Card>
                            <CardContent className="pt-6 space-y-4">
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Building</p>
                                    <p className="text-sm font-medium text-slate-900">{request.building.name}</p>
                                </div>

                                {request.location && (
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Location</p>
                                        <p className="text-sm font-medium text-slate-900 flex items-center gap-1">
                                            <MapPin className="h-3.5 w-3.5" />
                                            {request.location}
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Category</p>
                                    <p className="text-sm font-medium text-slate-900 capitalize">{request.category}</p>
                                </div>

                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Submitted By</p>
                                    <p className="text-sm font-medium text-slate-900 flex items-center gap-1">
                                        <User className="h-3.5 w-3.5" />
                                        {request.submittedBy.name}
                                    </p>
                                    <p className="text-xs text-slate-500">{request.submittedBy.email}</p>
                                </div>

                                {request.assignedTo && (
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Assigned To</p>
                                        <p className="text-sm font-medium text-slate-900">{request.assignedTo.name}</p>
                                        <p className="text-xs text-slate-500">{request.assignedTo.email}</p>
                                    </div>
                                )}

                                {request.resolvedAt && (
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Resolved At</p>
                                        <p className="text-sm font-medium text-slate-900">
                                            {format(request.resolvedAt, "MMM d, yyyy")}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <Card className="bg-slate-50">
                            <CardContent className="pt-6">
                                <p className="text-xs text-slate-600 mb-3">Need to update this request?</p>
                                <Button className="w-full" size="sm">Update Status</Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
