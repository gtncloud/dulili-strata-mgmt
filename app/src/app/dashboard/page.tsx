import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { verifySession } from "@/lib/session";
import { db } from "@/lib/db";
import {
    Wrench, FileText, Megaphone, Users, DollarSign,
    ArrowUpRight, Clock, AlertCircle, TrendingUp,
    Calendar, Plus, ChevronRight, MessageCircle, ShoppingBag
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { format, formatDistanceToNow } from "date-fns";

export default async function DashboardPage() {
    const session = await verifySession();

    if (!session?.isAuth) {
        redirect("/auth/login");
    }

    const membership = await db.buildingMembership.findFirst({
        where: { userId: session.userId, status: "active" },
        include: { building: true }
    });

    if (!membership) {
        return (
            <div className="p-6">
                <div className="max-w-2xl mx-auto mt-12 text-center">
                    <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="h-8 w-8 text-amber-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900 mb-2">No Building Assignment</h2>
                    <p className="text-sm text-slate-600">You are not assigned to any building yet.</p>
                </div>
            </div>
        );
    }

    // Fetch data
    const recentMaintenance = await db.maintenanceRequest.findMany({
        where: { buildingId: membership.buildingId, status: { not: "closed" } },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { submittedBy: { select: { name: true } } }
    });

    const urgentCount = await db.maintenanceRequest.count({
        where: { buildingId: membership.buildingId, priority: "urgent", status: { not: "closed" } }
    });

    const recentAnnouncements = await db.announcement.findMany({
        where: { buildingId: membership.buildingId },
        orderBy: { publishedAt: "desc" },
        take: 3,
        include: { author: { select: { name: true } } }
    });

    const membersCount = await db.buildingMembership.count({
        where: { buildingId: membership.buildingId, status: "active" }
    });

    const upcomingBookings = await db.amenityBooking.count({
        where: {
            buildingId: membership.buildingId,
            status: { in: ["confirmed", "pending"] },
            startTime: { gte: new Date() }
        }
    });

    const unreadMessages = await db.chatMessage.count({
        where: {
            channel: {
                buildingId: membership.buildingId,
                members: {
                    some: { userId: session.userId },
                },
            },
            createdAt: {
                gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
            },
        },
    });

    const activeListings = await db.marketplaceListing.count({
        where: {
            buildingId: membership.buildingId,
            status: "active",
        },
    });

    const totalFunds = membership.building.adminFundBalance + membership.building.capitalWorksBalance;

    const priorityConfig = {
        urgent: { color: "text-rose-600", bg: "bg-rose-50", dot: "bg-rose-500" },
        high: { color: "text-amber-600", bg: "bg-amber-50", dot: "bg-amber-500" },
        medium: { color: "text-blue-600", bg: "bg-blue-50", dot: "bg-blue-500" },
        low: { color: "text-slate-600", bg: "bg-slate-50", dot: "bg-slate-400" },
    };

    const statusConfig = {
        submitted: { label: "New", color: "bg-blue-500/10 text-blue-700" },
        reviewed: { label: "Reviewed", color: "bg-purple-500/10 text-purple-700" },
        in_progress: { label: "In Progress", color: "bg-amber-500/10 text-amber-700" },
        resolved: { label: "Resolved", color: "bg-emerald-500/10 text-emerald-700" },
    };

    return (
        <div className="max-w-[1400px] mx-auto">
            {/* Stats Grid - Modern Minimal Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 mb-5">
                <Link href="/dashboard/maintenance" className="group">
                    <Card className="border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all">
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                                <div className="w-9 h-9 rounded bg-amber-100 flex items-center justify-center">
                                    <Wrench className="h-4 w-4 text-amber-600" />
                                </div>
                                <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-2xl font-semibold text-gray-900">{recentMaintenance.length}</p>
                                <p className="text-xs text-gray-500">Open Maintenance</p>
                                {urgentCount > 0 && (
                                    <div className="flex items-center gap-1 pt-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                        <span className="text-xs text-rose-600 font-medium">{urgentCount} urgent</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/dashboard/announcements" className="group">
                    <Card className="border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all">
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                                <div className="w-9 h-9 rounded bg-blue-100 flex items-center justify-center">
                                    <Megaphone className="h-4 w-4 text-blue-600" />
                                </div>
                                <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-2xl font-semibold text-gray-900">{recentAnnouncements.length}</p>
                                <p className="text-xs text-gray-500">Recent Posts</p>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/dashboard/finance" className="group">
                    <Card className="border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all">
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                                <div className="w-9 h-9 rounded bg-emerald-100 flex items-center justify-center">
                                    <DollarSign className="h-4 w-4 text-emerald-600" />
                                </div>
                                <TrendingUp className="h-4 w-4 text-emerald-500" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-2xl font-semibold text-gray-900">
                                    ${(totalFunds / 1000).toFixed(0)}k
                                </p>
                                <p className="text-xs text-gray-500">Total Funds</p>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/dashboard/members" className="group">
                    <Card className="border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all">
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                                <div className="w-9 h-9 rounded bg-purple-100 flex items-center justify-center">
                                    <Users className="h-4 w-4 text-purple-600" />
                                </div>
                                <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-2xl font-semibold text-gray-900">{membersCount}</p>
                                <p className="text-xs text-gray-500">Active Members</p>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/dashboard/amenities" className="group">
                    <Card className="border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all">
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                                <div className="w-9 h-9 rounded bg-amber-100 flex items-center justify-center">
                                    <Calendar className="h-4 w-4 text-amber-600" />
                                </div>
                                <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-2xl font-semibold text-gray-900">{upcomingBookings}</p>
                                <p className="text-xs text-gray-500">Amenity Bookings</p>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/dashboard/community" className="group">
                    <Card className="border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all">
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                                <div className="w-9 h-9 rounded bg-blue-100 flex items-center justify-center">
                                    <MessageCircle className="h-4 w-4 text-blue-600" />
                                </div>
                                <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-2xl font-semibold text-gray-900">{unreadMessages}</p>
                                <p className="text-xs text-gray-500">New Messages</p>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/dashboard/marketplace" className="group">
                    <Card className="border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all">
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                                <div className="w-9 h-9 rounded bg-green-100 flex items-center justify-center">
                                    <ShoppingBag className="h-4 w-4 text-green-600" />
                                </div>
                                <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-2xl font-semibold text-gray-900">{activeListings}</p>
                                <p className="text-xs text-gray-500">Marketplace</p>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-5">
                {/* Recent Activity - 2 columns */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Maintenance Requests */}
                    <Card className="border-slate-200/60">
                        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-slate-900">Recent Maintenance</h3>
                            <Link href="/dashboard/maintenance">
                                <Button size="sm" className="h-8 text-xs bg-amber-600 hover:bg-amber-700 text-white gap-1">
                                    View all
                                    <ChevronRight className="h-3.5 w-3.5" />
                                </Button>
                            </Link>
                        </div>
                        <CardContent className="p-0">
                            {recentMaintenance.length === 0 ? (
                                <div className="py-12 text-center">
                                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                                        <Wrench className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <p className="text-sm text-slate-600 mb-1">No open requests</p>
                                    <p className="text-xs text-slate-400">All maintenance is up to date</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {recentMaintenance.map((request) => {
                                        const priority = priorityConfig[request.priority as keyof typeof priorityConfig];
                                        const status = statusConfig[request.status as keyof typeof statusConfig];

                                        return (
                                            <Link
                                                key={request.id}
                                                href="/dashboard/maintenance"
                                                className="block px-5 py-4 hover:bg-amber-50/50 transition-all duration-200 group border-l-2 border-transparent hover:border-amber-500"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={`w-8 h-8 rounded-lg ${priority.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                                        <Wrench className={`h-3.5 w-3.5 ${priority.color}`} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-2 mb-1">
                                                            <h4 className="text-sm font-medium text-slate-900 group-hover:text-amber-600 transition-colors">
                                                                {request.title}
                                                            </h4>
                                                            <Badge className={`text-xs px-2 py-0.5 ${status.color} border-0`}>
                                                                {status.label}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex items-center gap-3 text-xs text-slate-500">
                                                            <span className="flex items-center gap-1">
                                                                <div className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
                                                                {request.priority}
                                                            </span>
                                                            <span>•</span>
                                                            <span>{request.submittedBy.name}</span>
                                                            <span>•</span>
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="h-3 w-3" />
                                                                {formatDistanceToNow(request.createdAt, { addSuffix: true })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Announcements */}
                    {recentAnnouncements.length > 0 && (
                        <Card className="border-slate-200/60">
                            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-slate-900">Announcements</h3>
                                <Link href="/dashboard/announcements">
                                    <Button size="sm" className="h-8 text-xs bg-amber-600 hover:bg-amber-700 text-white gap-1">
                                        View all
                                        <ChevronRight className="h-3.5 w-3.5" />
                                    </Button>
                                </Link>
                            </div>
                            <CardContent className="p-0">
                                <div className="divide-y divide-slate-100">
                                    {recentAnnouncements.map((announcement) => (
                                        <Link
                                            key={announcement.id}
                                            href="/dashboard/announcements"
                                            className="block px-5 py-4 hover:bg-amber-50/50 transition-all duration-200 group border-l-2 border-transparent hover:border-amber-500"
                                        >
                                            <div className="flex gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                                                    <Megaphone className="h-3.5 w-3.5 text-amber-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-medium text-slate-900 mb-1 group-hover:text-amber-600 transition-colors">
                                                        {announcement.title}
                                                    </h4>
                                                    <p className="text-xs text-slate-600 line-clamp-2 mb-2">
                                                        {announcement.content}
                                                    </p>
                                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                                        <span>{announcement.author.name}</span>
                                                        <span>•</span>
                                                        <span>{format(announcement.publishedAt, "MMM d")}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar - Quick Actions */}
                <div className="space-y-4">
                    <Card className="border-slate-200/60">
                        <div className="px-5 py-4 border-b border-slate-100">
                            <h3 className="text-sm font-semibold text-slate-900">Quick Actions</h3>
                        </div>
                        <CardContent className="p-3 space-y-1.5">
                            <Link href="/dashboard/maintenance/new">
                                <Button variant="ghost" size="sm" className="w-full justify-start h-9 text-xs hover:bg-amber-50 hover:text-amber-700">
                                    <Wrench className="h-3.5 w-3.5 mr-2" />
                                    Report Issue
                                </Button>
                            </Link>
                            <Link href="/dashboard/documents/new">
                                <Button variant="ghost" size="sm" className="w-full justify-start h-9 text-xs hover:bg-amber-50 hover:text-amber-700">
                                    <FileText className="h-3.5 w-3.5 mr-2" />
                                    Upload Document
                                </Button>
                            </Link>
                            <Link href="/dashboard/announcements/new">
                                <Button variant="ghost" size="sm" className="w-full justify-start h-9 text-xs hover:bg-purple-50 hover:text-purple-700">
                                    <Megaphone className="h-3.5 w-3.5 mr-2" />
                                    New Announcement
                                </Button>
                            </Link>
                            <Link href="/dashboard/meetings">
                                <Button variant="ghost" size="sm" className="w-full justify-start h-9 text-xs hover:bg-blue-50 hover:text-blue-700">
                                    <Calendar className="h-3.5 w-3.5 mr-2" />
                                    View Meetings
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Building Info */}
                    <Card className="border-slate-200/60 bg-gradient-to-br from-indigo-50/50 to-purple-50/50">
                        <CardContent className="p-5">
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Building</p>
                                    <p className="text-sm font-semibold text-slate-900">{membership.building.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Address</p>
                                    <p className="text-xs text-slate-700 leading-relaxed">
                                        {membership.building.address}<br />
                                        {membership.building.suburb}, {membership.building.state} {membership.building.postcode}
                                    </p>
                                </div>
                                <Link href="/dashboard/building">
                                    <Button variant="outline" size="sm" className="w-full h-8 text-xs mt-2">
                                        View Details
                                        <ChevronRight className="h-3 w-3 ml-1" />
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
