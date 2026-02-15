"use client";

import { useState } from "react";
import { createSurvey } from "../actions";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical } from "lucide-react";

type QuestionType = "multiple_choice" | "single_choice" | "text" | "rating" | "yes_no";

interface Question {
    id: string;
    question: string;
    type: QuestionType;
    options: string[];
    isRequired: boolean;
}

export function SurveyForm() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState<"poll" | "survey" | "feedback">("survey");
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [questions, setQuestions] = useState<Question[]>([
        {
            id: crypto.randomUUID(),
            question: "",
            type: "single_choice",
            options: [""],
            isRequired: true,
        },
    ]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                id: crypto.randomUUID(),
                question: "",
                type: "single_choice",
                options: [""],
                isRequired: true,
            },
        ]);
    };

    const removeQuestion = (id: string) => {
        setQuestions(questions.filter((q) => q.id !== id));
    };

    const updateQuestion = (id: string, field: keyof Question, value: any) => {
        setQuestions(
            questions.map((q) =>
                q.id === id ? { ...q, [field]: value } : q
            )
        );
    };

    const addOption = (questionId: string) => {
        setQuestions(
            questions.map((q) =>
                q.id === questionId ? { ...q, options: [...q.options, ""] } : q
            )
        );
    };

    const removeOption = (questionId: string, index: number) => {
        setQuestions(
            questions.map((q) =>
                q.id === questionId
                    ? { ...q, options: q.options.filter((_, i) => i !== index) }
                    : q
            )
        );
    };

    const updateOption = (questionId: string, index: number, value: string) => {
        setQuestions(
            questions.map((q) =>
                q.id === questionId
                    ? {
                          ...q,
                          options: q.options.map((opt, i) =>
                              i === index ? value : opt
                          ),
                      }
                    : q
            )
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("type", type);
        formData.append("isAnonymous", String(isAnonymous));
        formData.append("startDate", startDate);
        formData.append("endDate", endDate);
        formData.append("questions", JSON.stringify(questions));

        try {
            await createSurvey(formData);
        } catch (error) {
            console.error(error);
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder="e.g., Annual Inspection Date Poll"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder="Provide additional context..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Type
                            </label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value as any)}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            >
                                <option value="poll">Poll</option>
                                <option value="survey">Survey</option>
                                <option value="feedback">Feedback</option>
                            </select>
                        </div>

                        <div className="flex items-center">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isAnonymous}
                                    onChange={(e) => setIsAnonymous(e.target.checked)}
                                    className="w-4 h-4 text-amber-500 border-gray-300 rounded focus:ring-amber-500"
                                />
                                <span className="text-sm text-gray-700">Anonymous responses</span>
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Start Date (Optional)
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                End Date (Optional)
                            </label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Questions */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Questions</h2>
                    <Button
                        type="button"
                        onClick={addQuestion}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Add Question
                    </Button>
                </div>

                {questions.map((question, qIndex) => (
                    <div
                        key={question.id}
                        className="bg-white border border-gray-200 rounded-lg p-6"
                    >
                        <div className="flex items-start gap-3 mb-4">
                            <GripVertical className="h-5 w-5 text-gray-400 mt-2" />
                            <div className="flex-1 space-y-4">
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={question.question}
                                        onChange={(e) =>
                                            updateQuestion(question.id, "question", e.target.value)
                                        }
                                        required
                                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        placeholder={`Question ${qIndex + 1}`}
                                    />
                                    <select
                                        value={question.type}
                                        onChange={(e) =>
                                            updateQuestion(question.id, "type", e.target.value)
                                        }
                                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    >
                                        <option value="single_choice">Single Choice</option>
                                        <option value="multiple_choice">Multiple Choice</option>
                                        <option value="text">Text Response</option>
                                        <option value="rating">Rating (1-5)</option>
                                        <option value="yes_no">Yes/No</option>
                                    </select>
                                </div>

                                {/* Options for choice questions */}
                                {(question.type === "single_choice" ||
                                    question.type === "multiple_choice") && (
                                    <div className="space-y-2 ml-6">
                                        {question.options.map((option, oIndex) => (
                                            <div key={oIndex} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={option}
                                                    onChange={(e) =>
                                                        updateOption(
                                                            question.id,
                                                            oIndex,
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                    className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                    placeholder={`Option ${oIndex + 1}`}
                                                />
                                                {question.options.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeOption(question.id, oIndex)
                                                        }
                                                        className="p-1.5 text-gray-400 hover:text-red-600"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => addOption(question.id)}
                                            className="text-sm text-amber-600 hover:text-amber-700"
                                        >
                                            + Add option
                                        </button>
                                    </div>
                                )}

                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={question.isRequired}
                                            onChange={(e) =>
                                                updateQuestion(
                                                    question.id,
                                                    "isRequired",
                                                    e.target.checked
                                                )
                                            }
                                            className="w-4 h-4 text-amber-500 border-gray-300 rounded focus:ring-amber-500"
                                        />
                                        <span className="text-sm text-gray-700">Required</span>
                                    </label>

                                    {questions.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeQuestion(question.id)}
                                            className="text-sm text-red-600 hover:text-red-700"
                                        >
                                            Remove question
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-amber-500 hover:bg-amber-600 text-white"
                >
                    {isSubmitting ? "Creating..." : "Create Survey"}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.history.back()}
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
}
