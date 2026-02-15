import { redirect } from "next/navigation";
import { verifySession } from "@/lib/session";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    ShoppingBag,
    Gift,
    Repeat,
    Wrench,
    HelpCircle,
    Package,
    MapPin,
    Phone,
    Calendar,
    User,
    ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { ListingActions } from "./listing-actions";

const categoryIcons = {
    sale: ShoppingBag,
    free: Gift,
    trade: Repeat,
    service: Wrench,
    wanted: HelpCircle,
    lending: Package,
};

const categoryLabels = {
    sale: "For Sale",
    free: "Free Stuff",
    trade: "Trade",
    service: "Services",
    wanted: "Wanted",
    lending: "Lending Library",
};

const categoryColors = {
    sale: "bg-green-100 text-green-800",
    free: "bg-blue-100 text-blue-800",
    trade: "bg-purple-100 text-purple-800",
    service: "bg-amber-100 text-amber-800",
    wanted: "bg-pink-100 text-pink-800",
    lending: "bg-teal-100 text-teal-800",
};

export default async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await verifySession();
    if (!session?.isAuth) redirect("/auth/login");

    const membership = await db.buildingMembership.findFirst({
        where: { userId: session.userId, status: "active" },
    });

    if (!membership) redirect("/dashboard");

    const { id } = await params;

    const listing = await db.marketplaceListing.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });

    if (!listing || listing.buildingId !== membership.buildingId) {
        redirect("/dashboard/marketplace");
    }

    const Icon = categoryIcons[listing.category as keyof typeof categoryIcons];
    const isOwner = listing.userId === session.userId;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Back Button */}
            <Link href="/dashboard/marketplace">
                <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-1.5" />
                    Back to Marketplace
                </Button>
            </Link>

            {/* Main Content */}
            <Card className="p-6">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Badge
                            className={
                                categoryColors[listing.category as keyof typeof categoryColors]
                            }
                        >
                            <Icon className="h-3 w-3 mr-1" />
                            {categoryLabels[listing.category as keyof typeof categoryLabels]}
                        </Badge>
                        <Badge
                            variant={listing.status === "active" ? "default" : "secondary"}
                            className={
                                listing.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                            }
                        >
                            {listing.status === "active" ? "Active" : "Closed"}
                        </Badge>
                    </div>
                    {listing.price !== null && (
                        <div className="text-3xl font-bold text-amber-600">${listing.price}</div>
                    )}
                </div>

                <h1 className="text-2xl font-semibold text-gray-900 mb-4">{listing.title}</h1>

                <div className="prose prose-sm max-w-none mb-6">
                    <p className="text-gray-700 whitespace-pre-wrap">{listing.description}</p>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6 border-t border-b">
                    {listing.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span>{listing.location}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>Posted {new Date(listing.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>

                {/* Seller Info */}
                <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">
                        {isOwner ? "Your Listing" : "Seller Information"}
                    </h3>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                                <User className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                                <div className="font-medium text-gray-900">{listing.user.name}</div>
                                {listing.contactInfo && (
                                    <div className="text-sm text-gray-600 flex items-center gap-1.5 mt-0.5">
                                        <Phone className="h-3 w-3" />
                                        {listing.contactInfo}
                                    </div>
                                )}
                            </div>
                        </div>

                        {!isOwner && listing.status === "active" && (
                            <Button className="bg-amber-600 hover:bg-amber-700">
                                Contact Seller
                            </Button>
                        )}
                    </div>
                </div>

                {/* Owner Actions */}
                {isOwner && (
                    <div className="mt-6 pt-6 border-t">
                        <ListingActions listingId={listing.id} status={listing.status} />
                    </div>
                )}
            </Card>
        </div>
    );
}
