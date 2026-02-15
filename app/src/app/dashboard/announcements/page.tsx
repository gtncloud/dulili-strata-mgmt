import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pin, Megaphone, Calendar, User, MessageSquare } from "lucide-react";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";
import { formatDistanceToNow, format } from "date-fns";

function getAudienceBadge(audience: string) {
    const variants = {
        all: { color: "bg-indigo-100 text-indigo-700 border-indigo-200", label: "All Residents" },
        owners: { color: "bg-emerald-100 text-emerald-700 border-emerald-200", label: "Owners Only" },
        tenants: { color: "bg-blue-100 text-blue-700 border-blue-200", label: "Tenants Only" },
        committee: { color: "bg-amber-100 text-amber-700 border-amber-200", label: "Committee" },
    };
    
    const variant = variants[audience as keyof typeof variants] || variants.all;
    
    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${variant.color}`}>
            {variant.label}
        </span>
    );
}

export default async function AnnouncementsPage() {
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
                <h1 className="text-2xl font-bold text-slate-900">Announcements</h1>
                <Card className="border-amber-200 bg-amber-50">
                    <CardContent className="pt-6">
                        <p className="text-amber-900">You are not assigned to any building.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const announcements = await db.announcement.findMany({
        where: { buildingId: membership.buildingId },
        orderBy: [
            { isPinned: "desc" },
            { publishedAt: "desc" }
        ],
        include: { 
            author: { select: { id: true, name: true, role: true } }
        }
    });

    const stats = {
        total: announcements.length,
        pinned: announcements.filter(a => a.isPinned).length,
        thisWeek: announcements.filter(a => {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return a.publishedAt >= weekAgo;
        }).length,
    };

    // Check if user can post (manager or committee)
    const canPost = ["manager", "committee", "admin"].includes(membership.role);

    return (
        <div className="flex flex-col gap-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Announcements</h1>
                    <p className="text-slate-600 mt-1">Stay updated with building news and notices</p>
                </div>
                {canPost && (
                    <Link href="/dashboard/announcements/new">
                        <Button className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-md">
                            <Plus className="mr-2 h-4 w-4" /> New Announcement
                        </Button>
                    </Link>
                )}
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-l-4 border-l-indigo-500">
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
                        <p className="text-xs text-slate-600 mt-1">Total Announcements</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-amber-500">
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-amber-600">{stats.pinned}</div>
                        <p className="text-xs text-slate-600 mt-1">Pinned</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-emerald-500">
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-emerald-600">{stats.thisWeek}</div>
                        <p className="text-xs text-slate-600 mt-1">This Week</p>
                    </CardContent>
                </Card>
            </div>

            {/* Announcements Feed */}
            <div className="grid gap-4">
                {announcements.length === 0 ? (
                    <Card className="border-dashed border-2">
                        <CardContent className="pt-12 pb-12 text-center">
                            <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <Megaphone className="h-8 w-8 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">No announcements yet</h3>
                            <p className="text-slate-600 mb-6">Be the first to share news with your building community</p>
                            {canPost && (
                                <Link href="/dashboard/announcements/new">
                                    <Button className="bg-gradient-primary">
                                        <Plus className="mr-2 h-4 w-4" /> Create First Announcement
                                    </Button>
                                </Link>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    announcements.map((announcement) => (
                        <Card 
                            key={announcement.id} 
                            className={`hover:shadow-md transition-shadow ${announcement.isPinned ? 'border-l-4 border-l-amber-500 bg-amber-50/30' : ''}`}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            {announcement.isPinned && (
                                                <Badge className="bg-amber-100 text-amber-700 border-amber-300">
                                                    <Pin className="h-3 w-3 mr-1" />
                                                    Pinned
                                                </Badge>
                                            )}
                                            {getAudienceBadge(announcement.targetAudience)}
                                        </div>
                                        <CardTitle className="text-xl font-bold text-slate-900 mb-2">
                                            {announcement.title}
                                        </CardTitle>
                                        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                                            <div className="flex items-center gap-1">
                                                <User className="h-4 w-4 text-slate-400" />
                                                <span>{announcement.author.name}</span>
                                                <span className="text-xs text-slate-400">({announcement.author.role})</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4 text-slate-400" />
                                                <span>{format(announcement.publishedAt, "MMM d, yyyy")}</span>
                                                <span className="text-slate-400">•</span>
                                                <span>{formatDistanceToNow(announcement.publishedAt, { addSuffix: true })}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="prose prose-sm max-w-none text-slate-700">
                                    {announcement.content.split('\n').map((paragraph, idx) => (
                                        <p key={idx} className="mb-2 last:mb-0">{paragraph}</p>
                                    ))}
                                </div>
                                
                                {/* Australian Compliance Footer */}
                                {announcement.isPinned && (
                                    <div className="mt-4 pt-4 border-t border-slate-200">
                                        <p className="text-xs text-slate-500">
                                            📋 This notice is displayed in accordance with NSW Strata Schemes Management Act 2015, 
                                            Section 143 (Notice Board Requirements)
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Australian Compliance Info */}
            <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                    <div className="flex gap-3">
                        <div className="text-2xl">🇦🇺</div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-blue-900 mb-1">Australian Strata Notice Requirements</h4>
                            <p className="text-sm text-blue-800">
                                All announcements are maintained as per NSW Strata Schemes Management Act 2015. 
                                Important notices are pinned for visibility and archived for compliance records.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
