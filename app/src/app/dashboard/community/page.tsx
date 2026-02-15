import { verifySession } from "@/lib/session";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MessageSquare, Users, Lock, Hash, Calendar } from "lucide-react";

export default async function CommunityPage() {
    const session = await verifySession();
    if (!session?.isAuth) redirect("/auth/login");

    const membership = await db.buildingMembership.findFirst({
        where: { userId: session.userId, status: "active" },
    });

    if (!membership) redirect("/dashboard");

    // Get channels user is a member of
    const channels = await db.chatChannel.findMany({
        where: {
            buildingId: membership.buildingId,
            members: {
                some: { userId: session.userId },
            },
        },
        include: {
            creator: { select: { name: true } },
            _count: {
                select: {
                    messages: true,
                    members: true,
                },
            },
            messages: {
                orderBy: { createdAt: "desc" },
                take: 1,
                include: {
                    user: { select: { name: true } },
                },
            },
        },
        orderBy: { updatedAt: "desc" },
    });

    const channelIcons: Record<string, any> = {
        general: Hash,
        maintenance: MessageSquare,
        social: Users,
        committee: Lock,
    };

    const channelColors: Record<string, string> = {
        general: "bg-blue-100 text-blue-600",
        maintenance: "bg-amber-100 text-amber-600",
        social: "bg-purple-100 text-purple-600",
        committee: "bg-gray-100 text-gray-600",
    };

    return (
        <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Community</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Chat with neighbors and schedule meetings
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/dashboard/community/new-channel"
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        New Channel
                    </Link>
                    <Link
                        href="/dashboard/meetings/new"
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors gap-2"
                    >
                        <Calendar className="h-4 w-4" />
                        Schedule Meeting
                    </Link>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                    href="/dashboard/meetings"
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:border-amber-300 hover:shadow-md transition-all"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-amber-600" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-gray-900">Meetings</h3>
                            <p className="text-sm text-gray-600">View & schedule</p>
                        </div>
                    </div>
                </Link>

                <Link
                    href="/dashboard/members"
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:border-amber-300 hover:shadow-md transition-all"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                            <Users className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-gray-900">Members</h3>
                            <p className="text-sm text-gray-600">View directory</p>
                        </div>
                    </div>
                </Link>

                <Link
                    href="/dashboard/announcements"
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:border-amber-300 hover:shadow-md transition-all"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                            <MessageSquare className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-gray-900">Announcements</h3>
                            <p className="text-sm text-gray-600">Official updates</p>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Chat Channels */}
            <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Chat Channels</h2>
                {channels.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {channels.map((channel) => {
                            const Icon = channelIcons[channel.type] || Hash;
                            const colorClass = channelColors[channel.type] || "bg-gray-100 text-gray-600";
                            const lastMessage = channel.messages[0];

                            return (
                                <Link
                                    key={channel.id}
                                    href={`/dashboard/community/${channel.id}`}
                                    className="bg-white border border-gray-200 rounded-lg p-6 hover:border-amber-300 hover:shadow-md transition-all"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`w-10 h-10 rounded-lg ${colorClass} flex items-center justify-center flex-shrink-0`}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-base font-semibold text-gray-900 truncate">
                                                    {channel.name}
                                                </h3>
                                                {channel.isPrivate && (
                                                    <Lock className="h-3 w-3 text-gray-400" />
                                                )}
                                            </div>
                                            {channel.description && (
                                                <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                                                    {channel.description}
                                                </p>
                                            )}
                                            {lastMessage ? (
                                                <p className="text-xs text-gray-500 line-clamp-1">
                                                    <span className="font-medium">{lastMessage.user.name}:</span>{" "}
                                                    {lastMessage.content}
                                                </p>
                                            ) : (
                                                <p className="text-xs text-gray-400">No messages yet</p>
                                            )}
                                            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                                                <span>{channel._count.members} members</span>
                                                <span>{channel._count.messages} messages</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-600 mb-4">No chat channels yet</p>
                        <Link
                            href="/dashboard/community/new-channel"
                            className="text-amber-600 hover:text-amber-700 text-sm font-medium"
                        >
                            Create the first channel →
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
