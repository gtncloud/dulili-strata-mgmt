
"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const CreateMaintenanceSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    category: z.string(),
    priority: z.string(),
    location: z.string().optional(),
});

export async function createMaintenanceRequest(prevState: any, formData: FormData) {
    const session = await verifySession();

    if (!session?.isAuth) {
        redirect("/auth/login");
    }

    // Get user's building
    // In a real app, user might have multiple memberships, but for MVP we take the first Active one
    const membership = await db.buildingMembership.findFirst({
        where: { userId: session.userId, status: "active" },
    });

    if (!membership) {
        return {
            errors: {
                form: "You are not a member of any building",
            },
        };
    }

    const validation = CreateMaintenanceSchema.safeParse(Object.fromEntries(formData));

    if (!validation.success) {
        return {
            errors: validation.error.flatten().fieldErrors,
        };
    }

    const { title, description, category, priority, location } = validation.data;

    try {
        await db.maintenanceRequest.create({
            data: {
                buildingId: membership.buildingId,
                submittedById: session.userId,
                title,
                description,
                category,
                priority,
                location: location || "",
                status: "submitted",
            },
        });
    } catch (error) {
        return {
            errors: {
                form: "Failed to create request. Please try again.",
            },
        };
    }

    revalidatePath("/dashboard/maintenance");
    redirect("/dashboard/maintenance");
}
