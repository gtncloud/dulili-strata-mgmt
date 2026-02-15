"use server";

import { db } from "@/lib/db";
import { verifySession } from "@/lib/session";
import { revalidatePath } from "next/cache";

interface UpdateWorkOrderData {
    status?: string;
    workNotes?: string;
    estimatedHours?: number;
    actualHours?: number;
    completionNotes?: string;
}

export async function updateWorkOrder(
    requestId: string,
    userId: string,
    data: UpdateWorkOrderData
) {
    try {
        const session = await verifySession();
        if (!session?.isAuth || session.userId !== userId) {
            return { success: false, error: "Unauthorized" };
        }

        const currentRequest = await db.maintenanceRequest.findUnique({
            where: { id: requestId },
        });

        if (!currentRequest) {
            return { success: false, error: "Request not found" };
        }

        // Update the request
        await db.maintenanceRequest.update({
            where: { id: requestId },
            data: {
                ...data,
                resolvedAt: data.status === "resolved" ? new Date() : currentRequest.resolvedAt,
            },
        });

        // Log the status change
        if (data.status && data.status !== currentRequest.status) {
            await db.maintenanceWorkLog.create({
                data: {
                    maintenanceRequestId: requestId,
                    userId,
                    action: "status_change",
                    notes: `Status changed from ${currentRequest.status} to ${data.status}`,
                    oldStatus: currentRequest.status,
                    newStatus: data.status,
                },
            });
        }

        revalidatePath(`/dashboard/work-orders/${requestId}`);
        revalidatePath("/dashboard/work-orders");
        return { success: true };
    } catch (error) {
        console.error("Error updating work order:", error);
        return { success: false, error: "Failed to update work order" };
    }
}

export async function assignWorkOrder(requestId: string, userId: string, assignToId: string) {
    try {
        const session = await verifySession();
        if (!session?.isAuth || session.userId !== userId) {
            return { success: false, error: "Unauthorized" };
        }

        await db.maintenanceRequest.update({
            where: { id: requestId },
            data: {
                assignedToId: assignToId,
                status: "reviewed",
            },
        });

        // Log the assignment
        await db.maintenanceWorkLog.create({
            data: {
                maintenanceRequestId: requestId,
                userId,
                action: "assigned",
                notes: "Work order assigned to maintenance staff",
                oldStatus: "submitted",
                newStatus: "reviewed",
            },
        });

        revalidatePath(`/dashboard/work-orders/${requestId}`);
        revalidatePath("/dashboard/work-orders");
        return { success: true };
    } catch (error) {
        console.error("Error assigning work order:", error);
        return { success: false, error: "Failed to assign work order" };
    }
}

interface AddWorkLogData {
    action: string;
    notes: string;
    hoursWorked?: number;
}

export async function addWorkLog(requestId: string, userId: string, data: AddWorkLogData) {
    try {
        const session = await verifySession();
        if (!session?.isAuth || session.userId !== userId) {
            return { success: false, error: "Unauthorized" };
        }

        await db.maintenanceWorkLog.create({
            data: {
                maintenanceRequestId: requestId,
                userId,
                action: data.action,
                notes: data.notes,
                hoursWorked: data.hoursWorked,
            },
        });

        // Update actual hours if provided
        if (data.hoursWorked) {
            const request = await db.maintenanceRequest.findUnique({
                where: { id: requestId },
            });

            if (request) {
                await db.maintenanceRequest.update({
                    where: { id: requestId },
                    data: {
                        actualHours: (request.actualHours || 0) + data.hoursWorked,
                    },
                });
            }
        }

        revalidatePath(`/dashboard/work-orders/${requestId}`);
        return { success: true };
    } catch (error) {
        console.error("Error adding work log:", error);
        return { success: false, error: "Failed to add work log" };
    }
}
