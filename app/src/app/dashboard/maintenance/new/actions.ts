"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const MaintenanceRequestSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters").max(200, "Title too long"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    category: z.enum(["plumbing", "electrical", "structural", "cosmetic", "other"]),
    priority: z.enum(["low", "medium", "high", "urgent"]),
    location: z.string().optional(),
});

export async function createMaintenanceRequest(prevState: any, formData: FormData) {
    try {
        // Verify user is authenticated
        const session = await verifySession();
        if (!session?.isAuth) {
            return { error: "You must be logged in to create a maintenance request" };
        }

        // Get user's building membership
        const membership = await db.buildingMembership.findFirst({
            where: {
                userId: session.userId,
                status: "active",
            },
        });

        if (!membership) {
            return { error: "You are not assigned to any building" };
        }

        // Validate form data
        const validation = MaintenanceRequestSchema.safeParse({
            title: formData.get("title"),
            description: formData.get("description"),
            category: formData.get("category"),
            priority: formData.get("priority"),
            location: formData.get("location") || undefined,
        });

        if (!validation.success) {
            return {
                errors: validation.error.flatten().fieldErrors,
            };
        }

        const { title, description, category, priority, location } = validation.data;

        // Create maintenance request
        const request = await db.maintenanceRequest.create({
            data: {
                buildingId: membership.buildingId,
                submittedById: session.userId,
                title,
                description,
                category,
                priority,
                location,
                status: "submitted",
            },
        });

        // Revalidate the maintenance page
        revalidatePath("/dashboard/maintenance");

        // Redirect to maintenance list
        redirect("/dashboard/maintenance");
    } catch (error) {
        console.error("Error creating maintenance request:", error);
        
        // If it's a redirect, re-throw it
        if (error instanceof Error && error.message === "NEXT_REDIRECT") {
            throw error;
        }
        
        return {
            error: "Failed to create maintenance request. Please try again.",
        };
    }
}
