import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/session";

export async function GET(request: NextRequest) {
    try {
        const session = await verifySession();
        if (!session?.isAuth) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get user's building
        const membership = await db.buildingMembership.findFirst({
            where: { userId: session.userId, status: "active" },
        });

        if (!membership) {
            return NextResponse.json({ results: [] });
        }

        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get("q") || "";

        if (query.length < 2) {
            return NextResponse.json({ results: [] });
        }

        const searchTerm = `%${query.toLowerCase()}%`;

        // Search documents
        const documents = await db.document.findMany({
            where: {
                buildingId: membership.buildingId,
                OR: [
                    { name: { contains: query, mode: "insensitive" } },
                    { category: { contains: query, mode: "insensitive" } },
                ],
            },
            take: 5,
            select: { id: true, name: true, category: true },
        });

        // Search maintenance requests
        const maintenance = await db.maintenanceRequest.findMany({
            where: {
                buildingId: membership.buildingId,
                OR: [
                    { title: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } },
                    { category: { contains: query, mode: "insensitive" } },
                ],
            },
            take: 5,
            select: { id: true, title: true, description: true, status: true },
        });

        // Search announcements
        const announcements = await db.announcement.findMany({
            where: {
                buildingId: membership.buildingId,
                OR: [
                    { title: { contains: query, mode: "insensitive" } },
                    { content: { contains: query, mode: "insensitive" } },
                ],
            },
            take: 5,
            select: { id: true, title: true, content: true },
        });

        // Search members (if user has permission)
        let members: any[] = [];
        if (["manager", "committee", "admin"].includes(membership.role)) {
            members = await db.user.findMany({
                where: {
                    memberships: {
                        some: {
                            buildingId: membership.buildingId,
                            status: "active",
                        },
                    },
                    OR: [
                        { name: { contains: query, mode: "insensitive" } },
                        { email: { contains: query, mode: "insensitive" } },
                    ],
                },
                take: 5,
                select: { id: true, name: true, email: true, role: true },
            });
        }

        // Search amenities
        const amenities = await db.amenity.findMany({
            where: {
                buildingId: membership.buildingId,
                isActive: true,
                OR: [
                    { name: { contains: query, mode: "insensitive" } },
                    { type: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } },
                ],
            },
            take: 5,
            select: { id: true, name: true, type: true, description: true },
        });

        // Search marketplace listings
        const marketplace = await db.marketplaceListing.findMany({
            where: {
                buildingId: membership.buildingId,
                status: "active",
                OR: [
                    { title: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } },
                    { category: { contains: query, mode: "insensitive" } },
                ],
            },
            take: 5,
            select: { id: true, title: true, description: true, category: true, price: true },
        });

        // Format results
        const results = [
            ...documents.map((doc) => ({
                id: doc.id,
                type: "document" as const,
                title: doc.name,
                description: doc.category,
                url: "/dashboard/documents",
            })),
            ...maintenance.map((req) => ({
                id: req.id,
                type: "maintenance" as const,
                title: req.title,
                description: req.description.substring(0, 100),
                url: `/dashboard/maintenance/${req.id}`,
            })),
            ...announcements.map((ann) => ({
                id: ann.id,
                type: "announcement" as const,
                title: ann.title,
                description: ann.content.substring(0, 100),
                url: "/dashboard/announcements",
            })),
            ...members.map((member) => ({
                id: member.id,
                type: "member" as const,
                title: member.name,
                description: member.email,
                url: "/dashboard/members",
            })),
            ...amenities.map((amenity) => ({
                id: amenity.id,
                type: "amenity" as const,
                title: amenity.name,
                description: amenity.description || amenity.type,
                url: `/dashboard/amenities/${amenity.id}`,
            })),
            ...marketplace.map((listing) => ({
                id: listing.id,
                type: "marketplace" as const,
                title: listing.title,
                description: `${listing.category} - ${listing.price ? `$${listing.price}` : "Free"}`,
                url: `/dashboard/marketplace/${listing.id}`,
            })),
        ];

        return NextResponse.json({ results });
    } catch (error) {
        console.error("Search error:", error);
        return NextResponse.json({ error: "Search failed" }, { status: 500 });
    }
}
