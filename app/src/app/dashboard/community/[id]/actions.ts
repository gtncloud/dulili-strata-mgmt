"use server";

import { db } from "@/lib/db";
import { verifySession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function sendMessage(channelId: string, userId: string, content: string) {
    try {
        const session = await verifySession();
        if (!session?.isAuth || session.userId !== userId) {
            return { success: false, error: "Unauthorized" };
        }

        // Verify user is a member of the channel
        const membership = await db.chatChannelMember.findFirst({
            where: {
                channelId,
                userId,
            },
        });

        if (!membership) {
            return { success: false, error: "Not a member of this channel" };
        }

        const message = await db.chatMessage.create({
            data: {
                channelId,
                userId,
                content,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        role: true,
                    },
                },
            },
        });

        // Update channel's updatedAt
        await db.chatChannel.update({
            where: { id: channelId },
            data: { updatedAt: new Date() },
        });

        revalidatePath(`/dashboard/community/${channelId}`);
        return { success: true, message };
    } catch (error) {
        console.error("Error sending message:", error);
        return { success: false, error: "Failed to send message" };
    }
}

export async function createChannel(
    buildingId: string,
    name: string,
    description: string,
    type: string,
    isPrivate: boolean,
    createdBy: string
) {
    try {
        const session = await verifySession();
        if (!session?.isAuth || session.userId !== createdBy) {
            return { success: false, error: "Unauthorized" };
        }

        const channel = await db.chatChannel.create({
            data: {
                buildingId,
                name,
                description,
                type,
                isPrivate,
                createdBy,
            },
        });

        // Add creator as moderator
        await db.chatChannelMember.create({
            data: {
                channelId: channel.id,
                userId: createdBy,
                role: "moderator",
            },
        });

        revalidatePath("/dashboard/community");
        return { success: true, channelId: channel.id };
    } catch (error) {
        console.error("Error creating channel:", error);
        return { success: false, error: "Failed to create channel" };
    }
}

export async function joinChannel(channelId: string, userId: string) {
    try {
        const session = await verifySession();
        if (!session?.isAuth || session.userId !== userId) {
            return { success: false, error: "Unauthorized" };
        }

        // Check if already a member
        const existing = await db.chatChannelMember.findFirst({
            where: { channelId, userId },
        });

        if (existing) {
            return { success: false, error: "Already a member" };
        }

        await db.chatChannelMember.create({
            data: {
                channelId,
                userId,
            },
        });

        revalidatePath(`/dashboard/community/${channelId}`);
        return { success: true };
    } catch (error) {
        console.error("Error joining channel:", error);
        return { success: false, error: "Failed to join channel" };
    }
}
