import { verifySession } from "@/lib/session";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import NewChannelForm from "./new-channel-form";

export default async function NewChannelPage() {
    const session = await verifySession();
    if (!session?.isAuth) redirect("/auth/login");

    const membership = await db.buildingMembership.findFirst({
        where: { userId: session.userId, status: "active" },
    });

    if (!membership) redirect("/dashboard");

    return (
        <div className="flex flex-col gap-8 max-w-2xl mx-auto w-full">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/dashboard/community"
                    className="text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Create New Channel</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Start a new conversation topic for your community
                    </p>
                </div>
            </div>

            {/* Form */}
            <div className="bg-white border border-gray-200 rounded-lg p-8">
                <NewChannelForm
                    buildingId={membership.buildingId}
                    userId={session.userId}
                />
            </div>
        </div>
    );
}
