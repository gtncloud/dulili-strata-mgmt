"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Users } from "lucide-react";
import Link from "next/link";

interface Answer {
    answer: string;
    response: {
        user: { name: string } | null;
    };
}

interface Question {
    id: string;
    question: string;
    type: string;
    options: string[];
    answers: Answer[];
}

interface Survey {
    id: string;
    title: string;
    description: string | null;
    type: string;
    status: string;
    isAnonymous: boolean;
    creator: { name: string };
    questions: Question[];
    _count: { responses: number };
}

interface Membership {
    role: string;
}

export function ResultsView({
    survey,
    membership,
}: {
    survey: Survey;
    membership: Membership;
}) {
    const isManager = ["manager", "committee", "admin"].includes(membership.role);

    const calculateResults = (question: Question) => {
        const totalAnswers = question.answers.length;

        if (question.type === "single_choice" || question.type === "multiple_choice") {
            const counts: Record<string, number> = {};
            question.options.forEach((opt) => (counts[opt] = 0));

            question.answers.forEach((answer) => {
                try {
                    const parsed = JSON.parse(answer.answer);
                    if (Array.isArray(parsed)) {
                        parsed.forEach((opt) => {
                            if (counts[opt] !== undefined) counts[opt]++;
                        });
                    } else if (counts[parsed] !== undefined) {
                        counts[parsed]++;
                    }
                } catch {
                    if (counts[answer.answer] !== undefined) {
                        counts[answer.answer]++;
                    }
                }
            });

            return Object.entries(counts).map(([option, count]) => ({
                option,
                count,
                percentage: totalAnswers > 0 ? (count / totalAnswers) * 100 : 0,
            }));
        }

        if (question.type === "rating") {
            const ratings = question.answers.map((a) => {
                try {
                    return JSON.parse(a.answer);
                } catch {
                    return parseInt(a.answer);
                }
            });
            const average =
                ratings.length > 0
                    ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
                    : 0;

            const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
            ratings.forEach((r) => {
                if (distribution[r] !== undefined) distribution[r]++;
            });

            return {
                average: average.toFixed(1),
                distribution: Object.entries(distribution).map(([rating, count]) => ({
                    rating: parseInt(rating),
                    count,
                    percentage: totalAnswers > 0 ? (count / totalAnswers) * 100 : 0,
                })),
            };
        }

        if (question.type === "yes_no") {
            const yes = question.answers.filter((a) => {
                try {
                    return JSON.parse(a.answer) === "yes";
                } catch {
                    return a.answer === "yes";
                }
            }).length;
            const no = totalAnswers - yes;

            return [
                {
                    option: "Yes",
                    count: yes,
                    percentage: totalAnswers > 0 ? (yes / totalAnswers) * 100 : 0,
                },
                {
                    option: "No",
                    count: no,
                    percentage: totalAnswers > 0 ? (no / totalAnswers) * 100 : 0,
                },
            ];
        }

        if (question.type === "text") {
            return question.answers.map((a) => {
                try {
                    return {
                        text: JSON.parse(a.answer),
                        user: a.response.user?.name,
                    };
                } catch {
                    return {
                        text: a.answer,
                        user: a.response.user?.name,
                    };
                }
            });
        }

        return null;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <Link
                    href="/dashboard/surveys"
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Surveys
                </Link>

                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">{survey.title}</h1>
                        {survey.description && (
                            <p className="text-sm text-gray-600 mt-2">{survey.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                            <span>Created by {survey.creator.name}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {survey._count.responses} responses
                            </span>
                            <span>•</span>
                            <span className="capitalize">{survey.status}</span>
                        </div>
                    </div>

                    {isManager && (
                        <Button variant="outline" size="sm" className="gap-2">
                            <Download className="h-4 w-4" />
                            Export
                        </Button>
                    )}
                </div>
            </div>

            {/* Results */}
            <div className="space-y-6">
                {survey.questions.map((question, index) => {
                    const results = calculateResults(question);

                    return (
                        <div
                            key={question.id}
                            className="bg-white border border-gray-200 rounded-lg p-6"
                        >
                            <h3 className="text-base font-semibold text-gray-900 mb-4">
                                {index + 1}. {question.question}
                            </h3>

                            {/* Choice Questions */}
                            {(question.type === "single_choice" ||
                                question.type === "multiple_choice" ||
                                question.type === "yes_no") &&
                                Array.isArray(results) && (
                                    <div className="space-y-3">
                                        {results.map((result: any) => (
                                            <div key={result.option}>
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-sm text-gray-700">
                                                        {result.option}
                                                    </span>
                                                    <span className="text-sm text-gray-600">
                                                        {result.count} ({result.percentage.toFixed(0)}%)
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-2">
                                                    <div
                                                        className="bg-amber-500 h-2 rounded-full transition-all"
                                                        style={{ width: `${result.percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                            {/* Rating Questions */}
                            {question.type === "rating" && results && (
                                <div>
                                    <div className="text-center mb-4">
                                        <div className="text-4xl font-bold text-gray-900">
                                            {(results as any).average}
                                        </div>
                                        <div className="text-sm text-gray-600">Average Rating</div>
                                    </div>
                                    <div className="space-y-2">
                                        {(results as any).distribution.map((dist: any) => (
                                            <div key={dist.rating} className="flex items-center gap-3">
                                                <span className="text-sm text-gray-700 w-12">
                                                    {dist.rating} ⭐
                                                </span>
                                                <div className="flex-1 bg-gray-100 rounded-full h-2">
                                                    <div
                                                        className="bg-amber-500 h-2 rounded-full"
                                                        style={{ width: `${dist.percentage}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm text-gray-600 w-16 text-right">
                                                    {dist.count} ({dist.percentage.toFixed(0)}%)
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Text Questions */}
                            {question.type === "text" && Array.isArray(results) && (
                                <div className="space-y-3">
                                    {results.length === 0 ? (
                                        <p className="text-sm text-gray-500 italic">
                                            No responses yet
                                        </p>
                                    ) : (
                                        results.map((result: any, idx: number) => (
                                            <div
                                                key={idx}
                                                className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                                            >
                                                <p className="text-sm text-gray-700">{result.text}</p>
                                                {!survey.isAnonymous && result.user && (
                                                    <p className="text-xs text-gray-500 mt-2">
                                                        — {result.user}
                                                    </p>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            <div className="mt-4 text-xs text-gray-500">
                                {question.answers.length} responses
                            </div>
                        </div>
                    );
                })}
            </div>

            {survey._count.responses === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">No responses yet</p>
                </div>
            )}
        </div>
    );
}
