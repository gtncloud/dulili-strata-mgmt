import { verifySession } from "@/lib/session";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, User, MapPin, Calendar } from "lucide-react";
import WorkOrderActions from "./work-order-actions";
import { formatDistanceToNow } from "date-fns";

export default async function WorkOrderDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const session = await verifySession();
    if (!session?.isAuth) redirect("/auth/login");

    const { id } = await params;

    // Only maintenance staff and managers can access
    const user = await db.user.findUnique({
        where: { id: session.userId },
    });

    if (!user || !["maintenance_staff", "manager", "admin"].includes(user.role)) {
        redirect("/dashboard");
    }

    const request = await db.maintenanceRequest.findUnique({
        where: { id },
        include: {
            building: { select: { name: true, address: true } },
            submittedBy: { select: { name: true, email: true, phone: true } },
            assignedTo: { select: { name: true, email: true } },
            photos: { orderBy: { createdAt: "asc" } },
            workLogs: {
                include: {
                    user: { select: { name: true } },
                },
                orderBy: { createdAt: "desc" },
            },
        },
    });

    if (!request) redirect("/dashboard/work-orders");

    // Get all maintenance staff for assignment
    const maintenanceStaff = await db.user.findMany({
        where: {
            role: { in: ["maintenance_staff", "manager"] },
        },
        select: { id: true, name: true },
    });

    const priorityColors: Record<string, string> = {
        urgent: "bg-red-100 text-red-700 border-red-200",
        high: "bg-orange-100 text-orange-700 border-orange-200",
        medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
        low: "bg-gray-100 text-gray-700 border-gray-200",
    };

    const statusColors: Record<string, string> = {
        submitted: "bg-blue-100 text-blue-700",
        reviewed: "bg-purple-100 text-purple-700",
        in_progress: "bg-amber-100 text-amber-700",
        resolved: "bg-green-100 text-green-700",
        closed: "bg-gray-100 text-gray-700",
    };

    return (
        <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/dashboard/work-orders"
                    className="text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-semibold text-gray-900">{request.title}</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Work Order #{request.id.slice(0, 8)}
                    </p>
                </div>
                <div className="flex gap-2">
                    <span
                        className={`px-3 py-1 text-sm font-medium rounded border ${
                            priorityColors[request.priority]
                        }`}
                    >
                        {request.priority}
                    </span>
                    <span
                        className={`px-3 py-1 text-sm font-medium rounded ${
                            statusColors[request.status]
                        }`}
                    >
                        {request.status.replace("_", " ")}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Description */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-base font-semibold text-gray-900 mb-4">Description</h2>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{request.description}</p>
                    </div>

                    {/* Work Notes */}
                    {request.workNotes && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                            <h2 className="text-base font-semibold text-gray-900 mb-4">Work Notes</h2>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{request.workNotes}</p>
                        </div>
                    )}

                    {/* Photos */}
                    {request.photos.length > 0 && (
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h2 className="text-base font-semibold text-gray-900 mb-4">Photos</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {request.photos.map((photo) => (
                                    <div key={photo.id} className="relative">
                                        <img
                                            src={photo.url}
                                            alt={photo.caption || "Maintenance photo"}
                                            className="w-full h-40 object-cover rounded-lg"
                                        />
                                        {photo.caption && (
                                            <p className="text-xs text-gray-600 mt-1">{photo.caption}</p>
                                        )}
                                        <span className="absolute top-2 right-2 px-2 py-1 text-xs font-medium bg-white rounded shadow">
                                            {photo.type}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Work Log */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-base font-semibold text-gray-900 mb-4">Work Log</h2>
                        {request.workLogs.length > 0 ? (
                            <div className="space-y-4">
                                {request.workLogs.map((log) => (
                                    <div key={log.id} className="flex gap-4">
                                        <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-medium text-gray-900">
                                                    {log.user.name}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {formatDistanceToNow(new Date(log.createdAt), {
                                                        addSuffix: true,
                                                    })}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-700 mb-1">
                                                <span className="font-medium">{log.action.replace("_", " ")}:</span>{" "}
                                                {log.notes}
                                            </p>
                                            {log.oldStatus && log.newStatus && (
                                                <p className="text-xs text-gray-500">
                                                    Status: {log.oldStatus} → {log.newStatus}
                                                </p>
                                            )}
                                            {log.hoursWorked && (
                                                <p className="text-xs text-gray-500">
                                                    Hours worked: {log.hoursWorked}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">No work logs yet</p>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Actions */}
                    <WorkOrderActions
                        requestId={request.id}
                        currentStatus={request.status}
                        currentAssignedTo={request.assignedToId}
                        userId={session.userId}
                        maintenanceStaff={maintenanceStaff}
                    />

                    {/* Details */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-base font-semibold text-gray-900 mb-4">Details</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-3">
                                <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-gray-500">Location</p>
                                    <p className="text-gray-900 font-medium">
                                        {request.location || "Not specified"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <User className="h-4 w-4 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-gray-500">Submitted By</p>
                                    <p className="text-gray-900 font-medium">{request.submittedBy.name}</p>
                                    <p className="text-gray-600 text-xs">{request.submittedBy.email}</p>
                                    {request.submittedBy.phone && (
                                        <p className="text-gray-600 text-xs">{request.submittedBy.phone}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <User className="h-4 w-4 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-gray-500">Assigned To</p>
                                    <p className="text-gray-900 font-medium">
                                        {request.assignedTo?.name || "Unassigned"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Calendar className="h-4 w-4 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-gray-500">Created</p>
                                    <p className="text-gray-900 font-medium">
                                        {new Date(request.createdAt).toLocaleDateString("en-AU", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                            </div>
                            {request.estimatedHours && (
                                <div className="flex items-start gap-3">
                                    <Clock className="h-4 w-4 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-gray-500">Estimated Hours</p>
                                        <p className="text-gray-900 font-medium">{request.estimatedHours}h</p>
                                    </div>
                                </div>
                            )}
                            {request.actualHours && (
                                <div className="flex items-start gap-3">
                                    <Clock className="h-4 w-4 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-gray-500">Actual Hours</p>
                                        <p className="text-gray-900 font-medium">{request.actualHours}h</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Building Info */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-base font-semibold text-gray-900 mb-4">Building</h2>
                        <p className="text-sm font-medium text-gray-900">{request.building.name}</p>
                        <p className="text-sm text-gray-600">{request.building.address}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
