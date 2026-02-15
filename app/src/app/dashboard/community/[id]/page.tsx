import { verifySession } from "@/lib/session";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, Calendar, Hash } from "lucide-react";
import ChatInterface from "./chat-interface";

export default async function ChannelPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const session = await verifySession();
    if (!session?.isAuth) redirect("/auth/login");

    const { id } = await params;

    // Check if user is a member of this channel
    const membership = await db.chatChannelMember.findFirst({
        where: {
            channelId: id,
            userId: session.userId,
        },
    });

    if (!membership) {
        redirect("/dashboard/community");
    }

    const channel = await db.chatChannel.findUnique({
        where: { id },
        include: {
            creator: { select: { name: true } },
            members: {
                include: {
                    user: { select: { id: true, name: true, role: true } },
                },
                orderBy: { joinedAt: "asc" },
            },
            messages: {
                include: {
                    user: { select: { id: true, name: true, role: true } },
                },
                orderBy: { createdAt: "asc" },
                take: 50,
            },
        },
    });

    if (!channel) {
        redirect("/dashboard/community");
    }

    const channelIcons: Record<string, any> = {
        general: Hash,
        maintenance: Hash,
        social: Hash,
        committee: Hash,
    };

    const Icon = channelIcons[channel.type] || Hash;

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard/community"
                        className="text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                            <Icon className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold text-gray-900">{channel.name}</h1>
                            <p className="text-xs text-gray-600">
                                {channel.members.length} members
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link
                        href={`/dashboard/community/${channel.id}/members`}
                        className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors gap-2"
                    >
                        <Users className="h-4 w-4" />
                        Members
                    </Link>
                    <Link
                        href="/dashboard/meetings/new"
                        className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors gap-2"
                    >
                        <Calendar className="h-4 w-4" />
                        Schedule Meeting
                    </Link>
                </div>
            </div>

            {/* Chat Interface */}
            <ChatInterface
                channelId={channel.id}
                userId={session.userId}
                initialMessages={channel.messages}
                members={channel.members.map((m) => m.user)}
            />
        </div>
    );
}
