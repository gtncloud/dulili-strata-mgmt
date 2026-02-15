import { verifySession } from "@/lib/session";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Crown, Shield } from "lucide-react";

export default async function ChannelMembersPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const session = await verifySession();
    if (!session?.isAuth) redirect("/auth/login");

    const { id } = await params;

    const channel = await db.chatChannel.findUnique({
        where: { id },
        include: {
            members: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true,
                        },
                    },
                },
                orderBy: [{ role: "desc" }, { joinedAt: "asc" }],
            },
        },
    });

    if (!channel) redirect("/dashboard/community");

    // Check if user is a member
    const isMember = channel.members.some((m) => m.userId === session.userId);
    if (!isMember) redirect("/dashboard/community");

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case "manager":
                return "bg-amber-100 text-amber-700";
            case "committee":
                return "bg-purple-100 text-purple-700";
            case "owner":
                return "bg-blue-100 text-blue-700";
            case "tenant":
                return "bg-gray-100 text-gray-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href={`/dashboard/community/${channel.id}`}
                    className="text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">{channel.name} Members</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        {channel.members.length} {channel.members.length === 1 ? "member" : "members"}
                    </p>
                </div>
            </div>

            {/* Members List */}
            <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
                {channel.members.map((member) => (
                    <div key={member.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-sm font-semibold text-gray-600">
                                        {member.user.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium text-gray-900">
                                            {member.user.name}
                                        </p>
                                        {member.role === "moderator" && (
                                            <Shield className="h-4 w-4 text-amber-600" />
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-600">{member.user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span
                                    className={`px-2 py-1 text-xs font-medium rounded ${getRoleBadgeColor(
                                        member.user.role
                                    )}`}
                                >
                                    {member.user.role}
                                </span>
                                {member.role === "moderator" && (
                                    <span className="px-2 py-1 text-xs font-medium rounded bg-amber-100 text-amber-700">
                                        Moderator
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
