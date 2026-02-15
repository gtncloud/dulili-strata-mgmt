import { verifySession } from "@/lib/session";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BarChart3, Clock, CheckCircle } from "lucide-react";

export default async function SurveysPage() {
    const session = await verifySession();
    if (!session?.isAuth) redirect("/auth/login");

    const membership = await db.buildingMembership.findFirst({
        where: { userId: session.userId, status: "active" },
    });

    if (!membership) redirect("/dashboard");

    // Get all surveys for this building
    const surveys = await db.survey.findMany({
        where: {
            buildingId: membership.buildingId,
            status: { in: ["active", "closed"] },
        },
        include: {
            creator: { select: { name: true } },
            _count: {
                select: { responses: true, questions: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    // Check which surveys user has responded to
    const userResponses = await db.surveyResponse.findMany({
        where: { userId: session.userId },
        select: { surveyId: true },
    });

    const respondedSurveyIds = new Set(userResponses.map((r) => r.surveyId));

    const activeSurveys = surveys.filter((s) => s.status === "active");
    const closedSurveys = surveys.filter((s) => s.status === "closed");

    const statusColors: Record<string, string> = {
        active: "bg-green-100 text-green-700",
        closed: "bg-gray-100 text-gray-700",
        draft: "bg-yellow-100 text-yellow-700",
    };

    const typeIcons: Record<string, string> = {
        poll: "📊",
        survey: "📋",
        feedback: "💬",
    };

    return (
        <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Surveys & Polls</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Share your feedback and help improve our community
                    </p>
                </div>
                {["manager", "committee", "admin"].includes(membership.role) && (
                    <Link
                        href="/dashboard/surveys/new"
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors"
                    >
                        Create Survey
                    </Link>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                            <BarChart3 className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-semibold text-gray-900">{activeSurveys.length}</p>
                            <p className="text-xs text-gray-600">Active Surveys</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                            <Clock className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-semibold text-gray-900">
                                {activeSurveys.filter((s) => !respondedSurveyIds.has(s.id)).length}
                            </p>
                            <p className="text-xs text-gray-600">Pending Response</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-semibold text-gray-900">
                                {activeSurveys.filter((s) => respondedSurveyIds.has(s.id)).length}
                            </p>
                            <p className="text-xs text-gray-600">Completed</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Active Surveys */}
            {activeSurveys.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Surveys</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activeSurveys.map((survey) => {
                            const hasResponded = respondedSurveyIds.has(survey.id);
                            return (
                                <div
                                    key={survey.id}
                                    className="bg-white border border-gray-200 rounded-lg p-6 hover:border-amber-300 hover:shadow-md transition-all"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">{typeIcons[survey.type]}</span>
                                            <span
                                                className={`px-2 py-1 text-xs font-medium rounded ${
                                                    statusColors[survey.status]
                                                }`}
                                            >
                                                {survey.status}
                                            </span>
                                        </div>
                                        {hasResponded && (
                                            <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-700">
                                                ✓ Completed
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-base font-semibold text-gray-900 mb-2">
                                        {survey.title}
                                    </h3>
                                    {survey.description && (
                                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                            {survey.description}
                                        </p>
                                    )}
                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                        <span>{survey._count.questions} questions</span>
                                        <span>{survey._count.responses} responses</span>
                                        {survey.endDate && (
                                            <span>
                                                Ends {new Date(survey.endDate).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        {!hasResponded ? (
                                            <Link
                                                href={`/dashboard/surveys/${survey.id}`}
                                                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors text-center"
                                            >
                                                Take Survey
                                            </Link>
                                        ) : (
                                            <Link
                                                href={`/dashboard/surveys/${survey.id}/results`}
                                                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-center"
                                            >
                                                View Results
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Closed Surveys */}
            {closedSurveys.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Closed Surveys</h2>
                    <div className="space-y-3">
                        {closedSurveys.map((survey) => (
                            <Link
                                key={survey.id}
                                href={`/dashboard/surveys/${survey.id}/results`}
                                className="block bg-gray-50 border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-all"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">{typeIcons[survey.type]}</span>
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-900">
                                                {survey.title}
                                            </h3>
                                            <p className="text-xs text-gray-600">
                                                {survey._count.responses} responses
                                            </p>
                                        </div>
                                    </div>
                                    <span
                                        className={`px-2 py-1 text-xs font-medium rounded ${
                                            statusColors[survey.status]
                                        }`}
                                    >
                                        Closed
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {surveys.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600 mb-4">No surveys available yet</p>
                    {["manager", "committee", "admin"].includes(membership.role) && (
                        <Link
                            href="/dashboard/surveys/new"
                            className="text-amber-600 hover:text-amber-700 text-sm font-medium"
                        >
                            Create the first survey →
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
