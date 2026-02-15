import { redirect } from "next/navigation";
import { verifySession } from "@/lib/session";
import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, ShoppingBag, Gift, Repeat, Wrench, HelpCircle, Package, ArrowLeft } from "lucide-react";

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

export default async function MyListingsPage() {
    const session = await verifySession();
    if (!session?.isAuth) redirect("/auth/login");

    const membership = await db.buildingMembership.findFirst({
        where: { userId: session.userId, status: "active" },
    });

    if (!membership) redirect("/dashboard");

    const listings = await db.marketplaceListing.findMany({
        where: {
            userId: session.userId,
            buildingId: membership.buildingId,
        },
        orderBy: { createdAt: "desc" },
    });

    const activeListings = listings.filter((l) => l.status === "active");
    const closedListings = listings.filter((l) => l.status !== "active");

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Link href="/dashboard/marketplace">
                        <Button variant="ghost" size="sm" className="mb-2">
                            <ArrowLeft className="h-4 w-4 mr-1.5" />
                            Back to Marketplace
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-semibold text-gray-900">My Listings</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Manage your marketplace listings
                    </p>
                </div>
                <Link href="/dashboard/marketplace/new">
                    <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                        <Plus className="h-4 w-4 mr-1.5" />
                        New Listing
                    </Button>
                </Link>
            </div>

            {/* Active Listings */}
            <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Active Listings ({activeListings.length})
                </h2>
                {activeListings.length === 0 ? (
                    <Card className="p-8 text-center">
                        <ShoppingBag className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-600 mb-4">No active listings</p>
                        <Link href="/dashboard/marketplace/new">
                            <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                                <Plus className="h-4 w-4 mr-1.5" />
                                Create Listing
                            </Button>
                        </Link>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {activeListings.map((listing) => {
                            const Icon = categoryIcons[listing.category as keyof typeof categoryIcons];
                            return (
                                <Link key={listing.id} href={`/dashboard/marketplace/${listing.id}`}>
                                    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer h-full">
                                        <div className="flex items-start justify-between mb-3">
                                            <Badge
                                                className={
                                                    categoryColors[
                                                        listing.category as keyof typeof categoryColors
                                                    ]
                                                }
                                            >
                                                <Icon className="h-3 w-3 mr-1" />
                                                {
                                                    categoryLabels[
                                                        listing.category as keyof typeof categoryLabels
                                                    ]
                                                }
                                            </Badge>
                                            {listing.price !== null && (
                                                <span className="text-lg font-semibold text-amber-600">
                                                    ${listing.price}
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                                            {listing.title}
                                        </h3>

                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                            {listing.description}
                                        </p>

                                        <div className="text-xs text-gray-500 pt-3 border-t">
                                            Posted {new Date(listing.createdAt).toLocaleDateString()}
                                        </div>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Closed Listings */}
            {closedListings.length > 0 && (
                <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        Closed Listings ({closedListings.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {closedListings.map((listing) => {
                            const Icon = categoryIcons[listing.category as keyof typeof categoryIcons];
                            return (
                                <Link key={listing.id} href={`/dashboard/marketplace/${listing.id}`}>
                                    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer h-full opacity-60">
                                        <div className="flex items-start justify-between mb-3">
                                            <Badge
                                                className={
                                                    categoryColors[
                                                        listing.category as keyof typeof categoryColors
                                                    ]
                                                }
                                            >
                                                <Icon className="h-3 w-3 mr-1" />
                                                {
                                                    categoryLabels[
                                                        listing.category as keyof typeof categoryLabels
                                                    ]
                                                }
                                            </Badge>
                                            <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                                                {listing.status}
                                            </Badge>
                                        </div>

                                        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                                            {listing.title}
                                        </h3>

                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                            {listing.description}
                                        </p>

                                        <div className="text-xs text-gray-500 pt-3 border-t">
                                            Posted {new Date(listing.createdAt).toLocaleDateString()}
                                        </div>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
