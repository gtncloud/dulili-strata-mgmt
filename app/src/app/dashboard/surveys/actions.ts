"use server";

import { db } from "@/lib/db";
import { verifySession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createSurvey(formData: FormData) {
    const session = await verifySession();
    if (!session?.isAuth) throw new Error("Unauthorized");

    const membership = await db.buildingMembership.findFirst({
        where: { userId: session.userId, status: "active" },
    });

    if (!membership || !["manager", "committee", "admin"].includes(membership.role)) {
        throw new Error("Unauthorized");
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const type = formData.get("type") as string;
    const isAnonymous = formData.get("isAnonymous") === "true";
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;
    const questionsJson = formData.get("questions") as string;

    const questions = JSON.parse(questionsJson);

    const survey = await db.survey.create({
        data: {
            buildingId: membership.buildingId,
            createdBy: session.userId,
            title,
            description,
            type,
            isAnonymous,
            status: "active",
            startDate: startDate ? new Date(startDate) : null,
            endDate: endDate ? new Date(endDate) : null,
            questions: {
                create: questions.map((q: any, index: number) => ({
                    question: q.question,
                    type: q.type,
                    options: q.options || [],
                    isRequired: q.isRequired !== false,
                    order: index,
                })),
            },
        },
    });

    revalidatePath("/dashboard/surveys");
    redirect("/dashboard/surveys");
}

export async function submitSurveyResponse(surveyId: string, answers: any[]) {
    const session = await verifySession();
    if (!session?.isAuth) throw new Error("Unauthorized");

    const membership = await db.buildingMembership.findFirst({
        where: { userId: session.userId, status: "active" },
    });

    if (!membership) throw new Error("Unauthorized");

    // Check if already responded
    const existing = await db.surveyResponse.findUnique({
        where: {
            surveyId_userId: {
                surveyId,
                userId: session.userId,
            },
        },
    });

    if (existing) throw new Error("You have already responded to this survey");

    // Create response with answers
    await db.surveyResponse.create({
        data: {
            surveyId,
            userId: session.userId,
            answers: {
                create: answers.map((a) => ({
                    questionId: a.questionId,
                    answer: JSON.stringify(a.answer),
                })),
            },
        },
    });

    revalidatePath(`/dashboard/surveys/${surveyId}`);
    return { success: true };
}

export async function closeSurvey(surveyId: string) {
    const session = await verifySession();
    if (!session?.isAuth) throw new Error("Unauthorized");

    const membership = await db.buildingMembership.findFirst({
        where: { userId: session.userId, status: "active" },
    });

    if (!membership || !["manager", "committee", "admin"].includes(membership.role)) {
        throw new Error("Unauthorized");
    }

    await db.survey.update({
        where: { id: surveyId },
        data: { status: "closed" },
    });

    revalidatePath("/dashboard/surveys");
    revalidatePath(`/dashboard/surveys/${surveyId}`);
}
