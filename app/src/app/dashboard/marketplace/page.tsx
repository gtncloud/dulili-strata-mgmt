import { redirect } from "next/navigation";
import { verifySession } from "@/lib/session";
import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, ShoppingBag, Gift, Repeat, Wrench, HelpCircle, Package } from "lucide-react";

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

export default async function MarketplacePage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string; search?: string }>;
}) {
    const session = await verifySession();
    if (!session?.isAuth) redirect("/auth/login");

    const membership = await db.buildingMembership.findFirst({
        where: { userId: session.userId, status: "active" },
        include: { building: true },
    });

    if (!membership) redirect("/dashboard");

    const params = await searchParams;
    const category = params.category;
    const search = params.search;

    const listings = await db.marketplaceListing.findMany({
        where: {
            buildingId: membership.buildingId,
            status: "active",
            ...(category && { category }),
            ...(search && {
                OR: [
                    { title: { contains: search, mode: "insensitive" } },
                    { description: { contains: search, mode: "insensitive" } },
                ],
            }),
        },
        include: {
            user: {
                select: {
                    name: true,
                    id: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    const categories = [
        { value: "sale", label: "For Sale", icon: ShoppingBag },
        { value: "free", label: "Free Stuff", icon: Gift },
        { value: "trade", label: "Trade", icon: Repeat },
        { value: "service", label: "Services", icon: Wrench },
        { value: "wanted", label: "Wanted", icon: HelpCircle },
        { value: "lending", label: "Lending", icon: Package },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Community Marketplace</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Buy, sell, trade, and share with your neighbors
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link href="/dashboard/marketplace/my-listings">
                        <Button variant="outline" size="sm">
                            My Listings
                        </Button>
                    </Link>
                    <Link href="/dashboard/marketplace/new">
                        <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                            <Plus className="h-4 w-4 mr-1.5" />
                            New Listing
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                <Link href="/dashboard/marketplace">
                    <Button
                        variant={!category ? "default" : "outline"}
                        size="sm"
                        className={!category ? "bg-amber-600 hover:bg-amber-700" : ""}
                    >
                        All
                    </Button>
                </Link>
                {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                        <Link key={cat.value} href={`/dashboard/marketplace?category=${cat.value}`}>
                            <Button
                                variant={category === cat.value ? "default" : "outline"}
                                size="sm"
                                className={
                                    category === cat.value ? "bg-amber-600 hover:bg-amber-700" : ""
                                }
                            >
                                <Icon className="h-4 w-4 mr-1.5" />
                                {cat.label}
                            </Button>
                        </Link>
                    );
                })}
            </div>

            {/* Search Bar */}
            <form className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    name="search"
                    placeholder="Search listings..."
                    defaultValue={search}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
            </form>

            {/* Listings Grid */}
            {listings.length === 0 ? (
                <Card className="p-12 text-center">
                    <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No listings found</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        {category
                            ? `No ${categoryLabels[category as keyof typeof categoryLabels].toLowerCase()} listings yet.`
                            : "Be the first to post something!"}
                    </p>
                    <Link href="/dashboard/marketplace/new">
                        <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                            <Plus className="h-4 w-4 mr-1.5" />
                            Create Listing
                        </Button>
                    </Link>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {listings.map((listing) => {
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

                                    <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t">
                                        <span>{listing.user.name}</span>
                                        <span>
                                            {new Date(listing.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
