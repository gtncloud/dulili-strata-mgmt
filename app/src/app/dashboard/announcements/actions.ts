"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";

const announcementSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters").max(200, "Title too long"),
    content: z.string().min(20, "Content must be at least 20 characters"),
    targetAudience: z.enum(["all", "owners", "tenants", "committee"]),
    isPinned: z.string().optional().transform(val => val === "on"),
});

export async function createAnnouncement(prevState: unknown, formData: FormData) {
    try {
        // Verify session
        const session = await verifySession();
        if (!session?.isAuth) {
            return { error: "Unauthorized" };
        }

        // Get user's building membership
        const membership = await db.buildingMembership.findFirst({
            where: { 
                userId: session.userId, 
                status: "active" 
            },
        });

        if (!membership) {
            return { error: "You are not assigned to any building" };
        }

        // Check if user can post (manager or committee)
        if (!["manager", "committee", "admin"].includes(membership.role)) {
            return { error: "Only managers and committee members can post announcements" };
        }

        // Validate form data
        const validatedData = announcementSchema.parse({
            title: formData.get("title"),
            content: formData.get("content"),
            targetAudience: formData.get("targetAudience"),
            isPinned: formData.get("isPinned"),
        });

        // Create announcement
        await db.announcement.create({
            data: {
                buildingId: membership.buildingId,
                authorId: session.userId,
                title: validatedData.title,
                content: validatedData.content,
                targetAudience: validatedData.targetAudience,
                isPinned: validatedData.isPinned,
            },
        });

        redirect("/dashboard/announcements");
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                errors: error.flatten().fieldErrors,
            };
        }
        console.error("Failed to create announcement:", error);
        return { error: "Failed to create announcement. Please try again." };
    }
}
