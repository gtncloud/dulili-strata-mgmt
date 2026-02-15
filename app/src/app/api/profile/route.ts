import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/session";

export async function PATCH(request: NextRequest) {
    try {
        const session = await verifySession();
        if (!session?.isAuth) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { name, phone } = body;

        if (!name || name.trim().length === 0) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        await db.user.update({
            where: { id: session.userId },
            data: {
                name: name.trim(),
                phone: phone?.trim() || null,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json(
            { error: "Failed to update profile" },
            { status: 500 }
        );
    }
}
