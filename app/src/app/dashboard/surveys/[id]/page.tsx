import { verifySession } from "@/lib/session";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { SurveyTaker } from "./survey-taker";

export default async function TakeSurveyPage({ params }: { params: Promise<{ id: string }> }) {
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
            questions: {
                orderBy: { order: "asc" },
            },
            creator: {
                select: { name: true },
            },
        },
    });

    if (!survey || survey.buildingId !== membership.buildingId) {
        redirect("/dashboard/surveys");
    }

    // Check if user already responded
    const existingResponse = await db.surveyResponse.findUnique({
        where: {
            surveyId_userId: {
                surveyId: id,
                userId: session.userId,
            },
        },
    });

    if (existingResponse) {
        redirect(`/dashboard/surveys/${id}/results`);
    }

    if (survey.status !== "active") {
        redirect("/dashboard/surveys");
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">{survey.title}</h1>
                {survey.description && (
                    <p className="text-sm text-gray-600 mt-2">{survey.description}</p>
                )}
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    <span>Created by {survey.creator.name}</span>
                    <span>•</span>
                    <span>{survey.questions.length} questions</span>
                    {survey.isAnonymous && (
                        <>
                            <span>•</span>
                            <span className="text-green-600">Anonymous</span>
                        </>
                    )}
                </div>
            </div>

            <SurveyTaker survey={survey} questions={survey.questions} />
        </div>
    );
}
