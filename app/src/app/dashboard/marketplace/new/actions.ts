"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createListing(formData: FormData) {
    try {
        const buildingId = formData.get("buildingId") as string;
        const userId = formData.get("userId") as string;
        const category = formData.get("category") as string;
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const priceStr = formData.get("price") as string;
        const location = formData.get("location") as string;
        const contactInfo = formData.get("contactInfo") as string;

        if (!buildingId || !userId || !category || !title || !description) {
            return { error: "Missing required fields" };
        }

        const price = priceStr ? parseFloat(priceStr) : null;

        await db.marketplaceListing.create({
            data: {
                buildingId,
                userId,
                category,
                title,
                description,
                price,
                location: location || null,
                contactInfo: contactInfo || null,
                images: [],
                status: "active",
            },
        });

        revalidatePath("/dashboard/marketplace");
        return { success: true };
    } catch (error) {
        console.error("Error creating listing:", error);
        return { error: "Failed to create listing" };
    }
}
