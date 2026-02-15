import { redirect } from "next/navigation";
import { verifySession } from "@/lib/session";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function MyProfilePage() {
    const session = await verifySession();
    if (!session?.isAuth) redirect("/auth/login");

    const membership = await db.buildingMembership.findFirst({
        where: { userId: session.userId, status: "active" },
    });

    if (!membership) redirect("/dashboard");

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <Link href="/dashboard/neighbors">
                <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-1.5" />
                    Back to Neighbors
                </Button>
            </Link>

            <div>
                <h1 className="text-2xl font-semibold text-gray-900">My Neighbor Profile</h1>
                <p className="text-sm text-gray-600 mt-1">
                    Share your interests and connect with neighbors
                </p>
            </div>

            <Card className="p-6">
                <p className="text-center text-gray-600 py-12">
                    Profile editor coming soon! You'll be able to add your bio, interests, and what you're looking for.
                </p>
            </Card>
        </div>
    );
}
