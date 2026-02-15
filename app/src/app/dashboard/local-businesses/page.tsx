import { redirect } from "next/navigation";
import { verifySession } from "@/lib/session";
import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Wrench, Briefcase, UtensilsCrossed, Store, AlertCircle, Star, Phone, Globe, MapPin } from "lucide-react";

const categoryIcons = {
    trades: Wrench,
    services: Briefcase,
    restaurants: UtensilsCrossed,
    shops: Store,
    emergency: AlertCircle,
};

const categoryLabels = {
    trades: "Trades",
    services: "Services",
    restaurants: "Restaurants",
    shops: "Shops",
    emergency: "Emergency",
};

const categoryColors = {
    trades: "bg-blue-100 text-blue-800",
    services: "bg-purple-100 text-purple-800",
    restaurants: "bg-orange-100 text-orange-800",
    shops: "bg-green-100 text-green-800",
    emergency: "bg-red-100 text-red-800",
};

export default async function LocalBusinessesPage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string; search?: string }>;
}) {
    const session = await verifySession();
    if (!session?.isAuth) redirect("/auth/login");

    const membership = await db.buildingMembership.findFirst({
        where: { userId: session.userId, status: "active" },
    });

    if (!membership) redirect("/dashboard");

    const params = await searchParams;
    const category = params.category;
    const search = params.search;

    const businesses = await db.localBusiness.findMany({
        where: {
            buildingId: membership.buildingId,
            ...(category && { category }),
            ...(search && {
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { description: { contains: search, mode: "insensitive" } },
                ],
            }),
        },
        include: {
            reviews: {
                select: {
                    rating: true,
                },
            },
        },
        orderBy: [
            { isEmergency: "desc" },
            { isVerified: "desc" },
            { name: "asc" },
        ],
    });

    const categories = [
        { value: "emergency", label: "Emergency", icon: AlertCircle },
        { value: "trades", label: "Trades", icon: Wrench },
        { value: "services", label: "Services", icon: Briefcase },
        { value: "restaurants", label: "Restaurants", icon: UtensilsCrossed },
        { value: "shops", label: "Shops", icon: Store },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Local Business Directory</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Trusted local businesses recommended by your neighbors
                    </p>
                </div>
                <Link href="/dashboard/local-businesses/new">
                    <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                        <Plus className="h-4 w-4 mr-1.5" />
                        Add Business
                    </Button>
                </Link>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                <Link href="/dashboard/local-businesses">
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
                        <Link key={cat.value} href={`/dashboard/local-businesses?category=${cat.value}`}>
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
                    placeholder="Search businesses..."
                    defaultValue={search}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
            </form>

            {/* Business List */}
            {businesses.length === 0 ? (
                <Card className="p-12 text-center">
                    <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No businesses found</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Be the first to add a local business recommendation!
                    </p>
                    <Link href="/dashboard/local-businesses/new">
                        <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                            <Plus className="h-4 w-4 mr-1.5" />
                            Add Business
                        </Button>
                    </Link>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {businesses.map((business) => {
                        const Icon = categoryIcons[business.category as keyof typeof categoryIcons];
                        const avgRating = business.reviews.length > 0
                            ? business.reviews.reduce((sum, r) => sum + r.rating, 0) / business.reviews.length
                            : 0;

                        return (
                            <Link key={business.id} href={`/dashboard/local-businesses/${business.id}`}>
                                <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer h-full">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                className={
                                                    categoryColors[
                                                        business.category as keyof typeof categoryColors
                                                    ]
                                                }
                                            >
                                                <Icon className="h-3 w-3 mr-1" />
                                                {
                                                    categoryLabels[
                                                        business.category as keyof typeof categoryLabels
                                                    ]
                                                }
                                            </Badge>
                                            {business.isVerified && (
                                                <Badge className="bg-green-100 text-green-800">
                                                    Verified
                                                </Badge>
                                            )}
                                            {business.isEmergency && (
                                                <Badge className="bg-red-100 text-red-800">
                                                    24/7
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    <h3 className="font-semibold text-gray-900 mb-2">{business.name}</h3>

                                    {business.description && (
                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                            {business.description}
                                        </p>
                                    )}

                                    <div className="space-y-1.5 text-sm text-gray-600">
                                        {business.phone && (
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-3.5 w-3.5 text-gray-400" />
                                                {business.phone}
                                            </div>
                                        )}
                                        {business.address && (
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-3.5 w-3.5 text-gray-400" />
                                                {business.address}
                                            </div>
                                        )}
                                        {business.website && (
                                            <div className="flex items-center gap-2">
                                                <Globe className="h-3.5 w-3.5 text-gray-400" />
                                                Website
                                            </div>
                                        )}
                                    </div>

                                    {business.reviews.length > 0 && (
                                        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t">
                                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                            <span className="text-sm font-medium text-gray-900">
                                                {avgRating.toFixed(1)}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                ({business.reviews.length} {business.reviews.length === 1 ? 'review' : 'reviews'})
                                            </span>
                                        </div>
                                    )}
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
