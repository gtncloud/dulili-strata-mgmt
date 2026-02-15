"use client";

import { useState } from "react";
import { submitSurveyResponse } from "../actions";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";

interface Question {
    id: string;
    question: string;
    type: string;
    options: string[];
    isRequired: boolean;
}

interface Survey {
    id: string;
    title: string;
}

export function SurveyTaker({
    survey,
    questions,
}: {
    survey: Survey;
    questions: Question[];
}) {
    const router = useRouter();
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const updateAnswer = (questionId: string, value: any) => {
        setAnswers({ ...answers, [questionId]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validate required questions
        const missingRequired = questions.filter(
            (q) => q.isRequired && !answers[q.id]
        );

        if (missingRequired.length > 0) {
            setError("Please answer all required questions");
            return;
        }

        setIsSubmitting(true);

        try {
            const answerArray = questions.map((q) => ({
                questionId: q.id,
                answer: answers[q.id] || null,
            }));

            await submitSurveyResponse(survey.id, answerArray);
            router.push(`/dashboard/surveys/${survey.id}/results`);
        } catch (err: any) {
            setError(err.message || "Failed to submit survey");
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {questions.map((question, index) => (
                <div key={question.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="mb-4">
                        <h3 className="text-base font-semibold text-gray-900">
                            {index + 1}. {question.question}
                            {question.isRequired && (
                                <span className="text-red-500 ml-1">*</span>
                            )}
                        </h3>
                    </div>

                    {/* Single Choice */}
                    {question.type === "single_choice" && (
                        <div className="space-y-2">
                            {question.options.map((option, oIndex) => (
                                <label
                                    key={oIndex}
                                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                                >
                                    <input
                                        type="radio"
                                        name={question.id}
                                        value={option}
                                        checked={answers[question.id] === option}
                                        onChange={(e) =>
                                            updateAnswer(question.id, e.target.value)
                                        }
                                        className="w-4 h-4 text-amber-500 border-gray-300 focus:ring-amber-500"
                                    />
                                    <span className="text-sm text-gray-700">{option}</span>
                                </label>
                            ))}
                        </div>
                    )}

                    {/* Multiple Choice */}
                    {question.type === "multiple_choice" && (
                        <div className="space-y-2">
                            {question.options.map((option, oIndex) => {
                                const selected = answers[question.id] || [];
                                return (
                                    <label
                                        key={oIndex}
                                        className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selected.includes(option)}
                                            onChange={(e) => {
                                                const newSelected = e.target.checked
                                                    ? [...selected, option]
                                                    : selected.filter((s: string) => s !== option);
                                                updateAnswer(question.id, newSelected);
                                            }}
                                            className="w-4 h-4 text-amber-500 border-gray-300 rounded focus:ring-amber-500"
                                        />
                                        <span className="text-sm text-gray-700">{option}</span>
                                    </label>
                                );
                            })}
                        </div>
                    )}

                    {/* Text Response */}
                    {question.type === "text" && (
                        <textarea
                            value={answers[question.id] || ""}
                            onChange={(e) => updateAnswer(question.id, e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder="Type your answer here..."
                        />
                    )}

                    {/* Rating */}
                    {question.type === "rating" && (
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <button
                                    key={rating}
                                    type="button"
                                    onClick={() => updateAnswer(question.id, rating)}
                                    className="p-2 hover:scale-110 transition-transform"
                                >
                                    <Star
                                        className={`h-8 w-8 ${
                                            answers[question.id] >= rating
                                                ? "fill-amber-400 text-amber-400"
                                                : "text-gray-300"
                                        }`}
                                    />
                                </button>
                            ))}
                            {answers[question.id] && (
                                <span className="ml-3 text-sm text-gray-600 self-center">
                                    {answers[question.id]} / 5
                                </span>
                            )}
                        </div>
                    )}

                    {/* Yes/No */}
                    {question.type === "yes_no" && (
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => updateAnswer(question.id, "yes")}
                                className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg border-2 transition-colors ${
                                    answers[question.id] === "yes"
                                        ? "border-green-500 bg-green-50 text-green-700"
                                        : "border-gray-200 text-gray-700 hover:bg-gray-50"
                                }`}
                            >
                                Yes
                            </button>
                            <button
                                type="button"
                                onClick={() => updateAnswer(question.id, "no")}
                                className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg border-2 transition-colors ${
                                    answers[question.id] === "no"
                                        ? "border-red-500 bg-red-50 text-red-700"
                                        : "border-gray-200 text-gray-700 hover:bg-gray-50"
                                }`}
                            >
                                No
                            </button>
                        </div>
                    )}
                </div>
            ))}

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            <div className="flex gap-3">
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-amber-500 hover:bg-amber-600 text-white"
                >
                    {isSubmitting ? "Submitting..." : "Submit Survey"}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/dashboard/surveys")}
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
}
