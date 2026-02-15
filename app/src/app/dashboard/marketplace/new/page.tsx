import { redirect } from "next/navigation";
import { verifySession } from "@/lib/session";
import { db } from "@/lib/db";
import { ListingForm } from "./listing-form";

export default async function NewListingPage() {
    const session = await verifySession();
    if (!session?.isAuth) redirect("/auth/login");

    const membership = await db.buildingMembership.findFirst({
        where: { userId: session.userId, status: "active" },
        include: { building: true },
    });

    if (!membership) redirect("/dashboard");

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">Create New Listing</h1>
                <p className="text-sm text-gray-600 mt-1">
                    Share items, services, or requests with your neighbors
                </p>
            </div>

            <ListingForm buildingId={membership.buildingId} userId={session.userId} />
        </div>
    );
}
