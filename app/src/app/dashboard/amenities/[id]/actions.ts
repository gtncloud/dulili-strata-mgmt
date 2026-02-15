"use server";

import { db } from "@/lib/db";
import { verifySession } from "@/lib/session";
import { revalidatePath } from "next/cache";

interface CreateBookingData {
    amenityId: string;
    userId: string;
    buildingId: string;
    startTime: Date;
    endTime: Date;
    purpose?: string;
    guestCount?: number;
    totalFee: number;
    depositPaid: number;
}

export async function createBooking(data: CreateBookingData) {
    try {
        const session = await verifySession();
        if (!session?.isAuth) {
            return { success: false, error: "Unauthorized" };
        }

        // Check for overlapping bookings
        const overlapping = await db.amenityBooking.findFirst({
            where: {
                amenityId: data.amenityId,
                status: { in: ["confirmed", "pending"] },
                OR: [
                    {
                        AND: [
                            { startTime: { lte: data.startTime } },
                            { endTime: { gt: data.startTime } },
                        ],
                    },
                    {
                        AND: [
                            { startTime: { lt: data.endTime } },
                            { endTime: { gte: data.endTime } },
                        ],
                    },
                    {
                        AND: [
                            { startTime: { gte: data.startTime } },
                            { endTime: { lte: data.endTime } },
                        ],
                    },
                ],
            },
        });

        if (overlapping) {
            return { success: false, error: "This time slot is already booked" };
        }

        await db.amenityBooking.create({
            data: {
                amenityId: data.amenityId,
                userId: data.userId,
                buildingId: data.buildingId,
                startTime: data.startTime,
                endTime: data.endTime,
                purpose: data.purpose,
                guestCount: data.guestCount,
                totalFee: data.totalFee,
                depositPaid: data.depositPaid,
                status: "confirmed",
                paymentStatus: data.totalFee > 0 ? "unpaid" : "paid",
            },
        });

        revalidatePath("/dashboard/amenities");
        return { success: true };
    } catch (error) {
        console.error("Error creating booking:", error);
        return { success: false, error: "Failed to create booking" };
    }
}

export async function cancelBooking(bookingId: string, reason?: string) {
    try {
        const session = await verifySession();
        if (!session?.isAuth) {
            return { success: false, error: "Unauthorized" };
        }

        const booking = await db.amenityBooking.findUnique({
            where: { id: bookingId },
        });

        if (!booking) {
            return { success: false, error: "Booking not found" };
        }

        if (booking.userId !== session.userId) {
            return { success: false, error: "You can only cancel your own bookings" };
        }

        await db.amenityBooking.update({
            where: { id: bookingId },
            data: {
                status: "cancelled",
                cancelledAt: new Date(),
                cancelReason: reason,
            },
        });

        revalidatePath("/dashboard/amenities");
        return { success: true };
    } catch (error) {
        console.error("Error cancelling booking:", error);
        return { success: false, error: "Failed to cancel booking" };
    }
}
