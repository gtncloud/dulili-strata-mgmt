import { verifySession } from "@/lib/session";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { SurveyForm } from "./survey-form";

export default async function NewSurveyPage() {
    const session = await verifySession();
    if (!session?.isAuth) redirect("/auth/login");

    const membership = await db.buildingMembership.findFirst({
        where: { userId: session.userId, status: "active" },
    });

    if (!membership || !["manager", "committee", "admin"].includes(membership.role)) {
        redirect("/dashboard/surveys");
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Create Survey</h1>
                <p className="text-sm text-gray-600 mt-1">
                    Create a new survey or poll for your community
                </p>
            </div>

            <SurveyForm />
        </div>
    );
}
