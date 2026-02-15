"use server";

import { db } from "@/lib/db";
import { verifySession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const meetingSchema = z.object({
  buildingId: z.string().min(1),
  type: z.enum(["agm", "egm", "committee"]),
  title: z.string().min(1, "Title is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().optional(),
  quorum: z.string().optional(),
});

export async function createMeeting(formData: FormData) {
  try {
    const session = await verifySession();

    // Validate form data
    const data = {
      buildingId: formData.get("buildingId") as string,
      type: formData.get("type") as "agm" | "egm" | "committee",
      title: formData.get("title") as string,
      date: formData.get("date") as string,
      time: formData.get("time") as string,
      location: formData.get("location") as string,
      description: formData.get("description") as string,
      quorum: formData.get("quorum") as string,
    };

    const validated = meetingSchema.parse(data);

    // Check user has permission
    const membership = await db.buildingMembership.findFirst({
      where: {
        userId: session.userId,
        buildingId: validated.buildingId,
      },
    });

    if (!membership || !["manager", "committee", "admin"].includes(membership.role)) {
      return { success: false, error: "Permission denied" };
    }

    // Combine date and time
    const scheduledAt = new Date(`${validated.date}T${validated.time}`);

    // Create meeting
    await db.meeting.create({
      data: {
        buildingId: validated.buildingId,
        type: validated.type,
        title: validated.title,
        scheduledAt,
        location: validated.location,
        description: validated.description || null,
        quorum: validated.quorum ? parseInt(validated.quorum) : null,
        status: "scheduled",
      },
    });

    revalidatePath("/dashboard/meetings");
    return { success: true };
  } catch (error) {
    console.error("Create meeting error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Failed to create meeting" };
  }
}
