"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function markAsSold(listingId: string) {
    try {
        await db.marketplaceListing.update({
            where: { id: listingId },
            data: { status: "sold" },
        });

        revalidatePath("/dashboard/marketplace");
        return { success: true };
    } catch (error) {
        console.error("Error marking as sold:", error);
        return { error: "Failed to update listing" };
    }
}

export async function markAsClosed(listingId: string) {
    try {
        await db.marketplaceListing.update({
            where: { id: listingId },
            data: { status: "closed" },
        });

        revalidatePath("/dashboard/marketplace");
        return { success: true };
    } catch (error) {
        console.error("Error closing listing:", error);
        return { error: "Failed to update listing" };
    }
}

export async function deleteListing(listingId: string) {
    try {
        await db.marketplaceListing.delete({
            where: { id: listingId },
        });

        revalidatePath("/dashboard/marketplace");
        return { success: true };
    } catch (error) {
        console.error("Error deleting listing:", error);
        return { error: "Failed to delete listing" };
    }
}
