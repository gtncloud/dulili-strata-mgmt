import { redirect } from "next/navigation";
import { verifySession } from "@/lib/session";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function NewBusinessPage() {
    const session = await verifySession();
    if (!session?.isAuth) redirect("/auth/login");

    const membership = await db.buildingMembership.findFirst({
        where: { userId: session.userId, status: "active" },
    });

    if (!membership) redirect("/dashboard");

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <Link href="/dashboard/local-businesses">
                <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-1.5" />
                    Back to Directory
                </Button>
            </Link>

            <div>
                <h1 className="text-2xl font-semibold text-gray-900">Add Local Business</h1>
                <p className="text-sm text-gray-600 mt-1">
                    Recommend a trusted local business to your neighbors
                </p>
            </div>

            <Card className="p-6">
                <p className="text-center text-gray-600 py-12">
                    Business submission form coming soon! For now, contact your building manager to add businesses.
                </p>
            </Card>
        </div>
    );
}
