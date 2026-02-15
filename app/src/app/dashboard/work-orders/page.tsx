import { verifySession } from "@/lib/session";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Clock, CheckCircle, AlertCircle, Wrench, Filter } from "lucide-react";

export default async function WorkOrdersPage() {
    const session = await verifySession();
    if (!session?.isAuth) redirect("/auth/login");

    // Only maintenance staff and managers can access
    const user = await db.user.findUnique({
        where: { id: session.userId },
    });

    if (!user || !["maintenance_staff", "manager", "admin"].includes(user.role)) {
        redirect("/dashboard");
    }

    // Get all maintenance requests
    const requests = await db.maintenanceRequest.findMany({
        include: {
            building: { select: { name: true } },
            submittedBy: { select: { name: true, email: true } },
            assignedTo: { select: { name: true } },
            _count: { select: { photos: true, workLogs: true } },
        },
        orderBy: [
            { priority: "desc" },
            { createdAt: "desc" },
        ],
    });

    // Filter by status
    const myActiveRequests = requests.filter(
        (r) => r.assignedToId === session.userId && !["resolved", "closed"].includes(r.status)
    );
    const unassignedRequests = requests.filter((r) => !r.assignedToId && r.status === "submitted");
    const inProgressRequests = requests.filter((r) => r.status === "in_progress");
    const urgentRequests = requests.filter((r) => r.priority === "urgent" && !["resolved", "closed"].includes(r.status));

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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Work Orders</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Maintenance team portal
                    </p>
                </div>
                <Link
                    href="/dashboard/maintenance"
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    View All Requests
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                            <Wrench className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-semibold text-gray-900">{myActiveRequests.length}</p>
                            <p className="text-xs text-gray-600">My Active Tasks</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <AlertCircle className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-semibold text-gray-900">{unassignedRequests.length}</p>
                            <p className="text-xs text-gray-600">Unassigned</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                            <Clock className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-semibold text-gray-900">{inProgressRequests.length}</p>
                            <p className="text-xs text-gray-600">In Progress</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                            <AlertCircle className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-semibold text-gray-900">{urgentRequests.length}</p>
                            <p className="text-xs text-gray-600">Urgent</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* My Active Tasks */}
            {myActiveRequests.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">My Active Tasks</h2>
                    <div className="space-y-3">
                        {myActiveRequests.map((request) => (
                            <Link
                                key={request.id}
                                href={`/dashboard/work-orders/${request.id}`}
                                className="block bg-white border border-gray-200 rounded-lg p-6 hover:border-amber-300 hover:shadow-md transition-all"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-base font-semibold text-gray-900">
                                                {request.title}
                                            </h3>
                                            <span
                                                className={`px-2 py-1 text-xs font-medium rounded border ${
                                                    priorityColors[request.priority]
                                                }`}
                                            >
                                                {request.priority}
                                            </span>
                                            <span
                                                className={`px-2 py-1 text-xs font-medium rounded ${
                                                    statusColors[request.status]
                                                }`}
                                            >
                                                {request.status.replace("_", " ")}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">{request.description}</p>
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <span>📍 {request.location || "No location"}</span>
                                            <span>🏢 {request.building.name}</span>
                                            <span>👤 {request.submittedBy.name}</span>
                                            {request._count.workLogs > 0 && (
                                                <span>📝 {request._count.workLogs} logs</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Unassigned Requests */}
            {unassignedRequests.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Unassigned Requests</h2>
                    <div className="space-y-3">
                        {unassignedRequests.map((request) => (
                            <Link
                                key={request.id}
                                href={`/dashboard/work-orders/${request.id}`}
                                className="block bg-white border border-gray-200 rounded-lg p-6 hover:border-amber-300 hover:shadow-md transition-all"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-base font-semibold text-gray-900">
                                                {request.title}
                                            </h3>
                                            <span
                                                className={`px-2 py-1 text-xs font-medium rounded border ${
                                                    priorityColors[request.priority]
                                                }`}
                                            >
                                                {request.priority}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{request.description}</p>
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <span>📍 {request.location || "No location"}</span>
                                            <span>🏢 {request.building.name}</span>
                                            <span>👤 {request.submittedBy.name}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* All Requests */}
            <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">All Work Orders</h2>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium text-gray-700">Title</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-700">Priority</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-700">Location</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-700">Assigned To</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-700">Created</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {requests.map((request) => (
                                    <tr key={request.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <Link
                                                href={`/dashboard/work-orders/${request.id}`}
                                                className="text-gray-900 hover:text-amber-600 font-medium"
                                            >
                                                {request.title}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`px-2 py-1 text-xs font-medium rounded border ${
                                                    priorityColors[request.priority]
                                                }`}
                                            >
                                                {request.priority}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`px-2 py-1 text-xs font-medium rounded ${
                                                    statusColors[request.status]
                                                }`}
                                            >
                                                {request.status.replace("_", " ")}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">{request.location || "-"}</td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {request.assignedTo?.name || "Unassigned"}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {new Date(request.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
