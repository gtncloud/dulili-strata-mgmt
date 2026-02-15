import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Wrench, AlertTriangle, CheckCircle, Clock, MapPin, User } from "lucide-react";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

function getStatusBadge(status: string) {
    const variants = {
        submitted: { icon: Clock, color: "bg-amber-100 text-amber-700 border-amber-200" },
        reviewed: { icon: CheckCircle, color: "bg-blue-100 text-blue-700 border-blue-200" },
        in_progress: { icon: Wrench, color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
        resolved: { icon: CheckCircle, color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
        closed: { icon: CheckCircle, color: "bg-slate-100 text-slate-700 border-slate-200" },
    };

    const variant = variants[status as keyof typeof variants] || variants.submitted;
    const Icon = variant.icon;

    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${variant.color}`}>
            <Icon className="h-3 w-3" />
            {status.replace("_", " ")}
        </span>
    );
}

function getPriorityBadge(priority: string) {
    const colors = {
        urgent: "bg-rose-100 text-rose-700 border-rose-300 font-semibold",
        high: "bg-orange-100 text-orange-700 border-orange-200",
        medium: "bg-blue-100 text-blue-700 border-blue-200",
        low: "bg-slate-100 text-slate-600 border-slate-200",
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${colors[priority as keyof typeof colors] || colors.low}`}>
            {priority === "urgent" && "🔴 "}
            {priority.toUpperCase()}
        </span>
    );
}

function getCategoryIcon(category: string) {
    const icons = {
        plumbing: "💧",
        electrical: "⚡",
        structural: "🏗️",
        cosmetic: "🎨",
        other: "🔧",
    };
    return icons[category as keyof typeof icons] || icons.other;
}

export default async function MaintenancePage() {
    const session = await verifySession();

    if (!session?.isAuth) {
        redirect("/auth/login");
    }

    // Get user's building
    const membership = await db.buildingMembership.findFirst({
        where: { userId: session.userId, status: "active" },
    });

    if (!membership) {
        return (
            <div className="flex flex-col gap-6 p-6">
                <h1 className="text-2xl font-bold text-slate-900">Maintenance Requests</h1>
                <Card className="border-amber-200 bg-amber-50">
                    <CardContent className="pt-6">
                        <p className="text-amber-900">You are not assigned to any building.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const requests = await db.maintenanceRequest.findMany({
        where: { buildingId: membership.buildingId },
        orderBy: { createdAt: "desc" },
        include: {
            submittedBy: { select: { id: true, name: true, email: true } },
            assignedTo: { select: { id: true, name: true } }
        }
    });

    const stats = {
        total: requests.length,
        urgent: requests.filter(r => r.priority === "urgent").length,
        inProgress: requests.filter(r => r.status === "in_progress").length,
        resolved: requests.filter(r => r.status === "resolved").length,
    };

    return (
        <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full animate-in-up">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Maintenance Requests</h1>
                    <p className="text-slate-500 mt-1">Track and manage building maintenance issues</p>
                </div>
                <Link href="/dashboard/maintenance/new">
                    <Button className="bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all">
                        <Plus className="mr-2 h-4 w-4" /> New Request
                    </Button>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-4">
                <div className="glass-card rounded-2xl p-6 border-l-4 border-l-slate-500">
                    <div className="text-3xl font-bold text-slate-900">{stats.total}</div>
                    <p className="text-sm font-medium text-slate-500 mt-1">Total Requests</p>
                </div>
                <div className="glass-card rounded-2xl p-6 border-l-4 border-l-rose-500">
                    <div className="text-3xl font-bold text-rose-600">{stats.urgent}</div>
                    <p className="text-sm font-medium text-slate-500 mt-1">Urgent Attention</p>
                </div>
                <div className="glass-card rounded-2xl p-6 border-l-4 border-l-indigo-500">
                    <div className="text-3xl font-bold text-amber-600">{stats.inProgress}</div>
                    <p className="text-sm font-medium text-slate-500 mt-1">In Progress</p>
                </div>
                <div className="glass-card rounded-2xl p-6 border-l-4 border-l-emerald-500">
                    <div className="text-3xl font-bold text-emerald-600">{stats.resolved}</div>
                    <p className="text-sm font-medium text-slate-500 mt-1">Resolved</p>
                </div>
            </div>

            {/* Requests List */}
            <div className="grid gap-4">
                {requests.length === 0 ? (
                    <div className="glass-card rounded-2xl p-12 text-center border-dashed border-2 border-slate-300">
                        <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <Wrench className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">No maintenance requests yet</h3>
                        <p className="text-slate-600 mb-6">Create your first maintenance request to get started</p>
                        <Link href="/dashboard/maintenance/new">
                            <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                                <Plus className="mr-2 h-4 w-4" /> Create First Request
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {requests.map((request) => (
                            <Link key={request.id} href={`/dashboard/maintenance/${request.id}`} className="block glass-card rounded-xl p-6 hover:bg-white/60 transition-colors cursor-pointer group border border-white/20 shadow-sm hover:shadow-md">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-2xl filter drop-shadow-sm">{getCategoryIcon(request.category)}</span>
                                            {getPriorityBadge(request.priority)}
                                            {getStatusBadge(request.status)}
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-amber-600 transition-colors">
                                            {request.title}
                                        </h3>
                                        <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                                            {request.description}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
                                            {request.location && (
                                                <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md">
                                                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                                    <span>{request.location}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1.5">
                                                <User className="h-3.5 w-3.5 text-slate-400" />
                                                <span>{request.submittedBy.name}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="h-3.5 w-3.5 text-slate-400" />
                                                <span>{formatDistanceToNow(request.createdAt, { addSuffix: true })}</span>
                                            </div>
                                            {request.assignedTo && (
                                                <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
                                                    <Wrench className="h-3.5 w-3.5" />
                                                    <span>Assigned to {request.assignedTo.name}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
