import { verifySession } from "@/lib/session";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ResultsView } from "./results-view";

export default async function SurveyResultsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await verifySession();
    if (!session?.isAuth) redirect("/auth/login");

    const membership = await db.buildingMembership.findFirst({
        where: { userId: session.userId, status: "active" },
    });

    if (!membership) redirect("/dashboard");

    const survey = await db.survey.findUnique({
        where: { id },
        include: {
            creator: { select: { name: true } },
            questions: {
                orderBy: { order: "asc" },
                include: {
                    answers: {
                        include: {
                            response: {
                                include: {
                                    user: { select: { name: true } },
                                },
                            },
                        },
                    },
                },
            },
            _count: {
                select: { responses: true },
            },
        },
    });

    if (!survey || survey.buildingId !== membership.buildingId) {
        redirect("/dashboard/surveys");
    }

    return (
        <div className="max-w-5xl mx-auto">
            <ResultsView survey={survey} membership={membership} />
        </div>
    );
}
