"use server";

import { db } from "@/lib/db";
import { verifySession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const documentSchema = z.object({
  name: z.string().min(1, "Document name is required"),
  category: z.enum(["insurance", "minutes", "financial", "compliance", "bylaws", "other"]),
  expiryDate: z.string().optional(),
  fileUrl: z.string().min(1, "File URL is required"),
  fileName: z.string().min(1, "File name is required"),
  fileSize: z.number().min(1, "File size is required"),
  mimeType: z.string().min(1, "MIME type is required"),
});

export async function createDocument(data: {
  name: string;
  category: string;
  expiryDate?: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}) {
  try {
    console.log('createDocument called with:', data);
    
    const session = await verifySession();
    console.log('Session:', session);

    // Get user's building membership
    const membership = await db.buildingMembership.findFirst({
      where: { userId: session.userId },
    });
    console.log('Membership:', membership);

    if (!membership) {
      console.error('No building membership found for user:', session.userId);
      return { success: false, error: "No building membership found" };
    }

    // Validate data
    console.log('Validating data...');
    const validated = documentSchema.parse(data);
    console.log('Validation passed:', validated);

    // Create document record
    console.log('Creating document in database...');
    const document = await db.document.create({
      data: {
        buildingId: membership.buildingId,
        name: validated.name,
        category: validated.category,
        fileUrl: validated.fileUrl,
        fileName: validated.fileName,
        fileSize: validated.fileSize,
        mimeType: validated.mimeType,
        version: 1,
        expiresAt: validated.expiryDate ? new Date(validated.expiryDate) : null,
        uploadedBy: session.userId,
      },
    });
    console.log('Document created:', document);

    revalidatePath("/dashboard/documents");
    return { success: true, documentId: document.id };
  } catch (error) {
    console.error("Create document error:", error);
    if (error instanceof z.ZodError) {
      console.error("Validation errors:", error.errors);
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Failed to create document" };
  }
}
