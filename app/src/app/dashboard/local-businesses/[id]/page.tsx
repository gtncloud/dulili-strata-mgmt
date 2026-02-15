import { redirect } from "next/navigation";
import { verifySession } from "@/lib/session";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wrench, Briefcase, UtensilsCrossed, Store, AlertCircle, Star, Phone, Globe, MapPin, Clock, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";

const categoryIcons = {
    trades: Wrench,
    services: Briefcase,
    restaurants: UtensilsCrossed,
    shops: Store,
    emergency: AlertCircle,
};

const categoryColors = {
    trades: "bg-blue-100 text-blue-800",
    services: "bg-purple-100 text-purple-800",
    restaurants: "bg-orange-100 text-orange-800",
    shops: "bg-green-100 text-green-800",
    emergency: "bg-red-100 text-red-800",
};

export default async function BusinessDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await verifySession();
    if (!session?.isAuth) redirect("/auth/login");

    const membership = await db.buildingMembership.findFirst({
        where: { userId: session.userId, status: "active" },
    });

    if (!membership) redirect("/dashboard");

    const { id } = await params;

    const business = await db.localBusiness.findUnique({
        where: { id },
        include: {
            reviews: {
                include: {
                    user: {
                        select: { name: true },
                    },
                },
                orderBy: { createdAt: "desc" },
            },
        },
    });

    if (!business || business.buildingId !== membership.buildingId) {
        redirect("/dashboard/local-businesses");
    }

    const Icon = categoryIcons[business.category as keyof typeof categoryIcons];
    const avgRating = business.reviews.length > 0
        ? business.reviews.reduce((sum, r) => sum + r.rating, 0) / business.reviews.length
        : 0;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Link href="/dashboard/local-businesses">
                <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-1.5" />
                    Back to Directory
                </Button>
            </Link>

            <Card className="p-6">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Badge className={categoryColors[business.category as keyof typeof categoryColors]}>
                            <Icon className="h-3 w-3 mr-1" />
                            {business.category}
                        </Badge>
                        {business.isVerified && (
                            <Badge className="bg-green-100 text-green-800">Verified</Badge>
                        )}
                        {business.isEmergency && (
                            <Badge className="bg-red-100 text-red-800">24/7 Emergency</Badge>
                        )}
                    </div>
                </div>

                <h1 className="text-2xl font-semibold text-gray-900 mb-4">{business.name}</h1>

                {business.description && (
                    <p className="text-gray-700 mb-6">{business.description}</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6 border-t border-b">
                    {business.phone && (
                        <div className="flex items-center gap-3">
                            <Phone className="h-5 w-5 text-gray-400" />
                            <div>
                                <div className="text-xs text-gray-500">Phone</div>
                                <a href={`tel:${business.phone}`} className="text-sm text-amber-600 hover:text-amber-700">
                                    {business.phone}
                                </a>
                            </div>
                        </div>
                    )}
                    {business.email && (
                        <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-gray-400" />
                            <div>
                                <div className="text-xs text-gray-500">Email</div>
                                <a href={`mailto:${business.email}`} className="text-sm text-amber-600 hover:text-amber-700">
                                    {business.email}
                                </a>
                            </div>
                        </div>
                    )}
                    {business.website && (
                        <div className="flex items-center gap-3">
                            <Globe className="h-5 w-5 text-gray-400" />
                            <div>
                                <div className="text-xs text-gray-500">Website</div>
                                <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-sm text-amber-600 hover:text-amber-700">
                                    Visit Website
                                </a>
                            </div>
                        </div>
                    )}
                    {business.address && (
                        <div className="flex items-center gap-3">
                            <MapPin className="h-5 w-5 text-gray-400" />
                            <div>
                                <div className="text-xs text-gray-500">Address</div>
                                <div className="text-sm text-gray-900">{business.address}</div>
                            </div>
                        </div>
                    )}
                    {business.hours && (
                        <div className="flex items-center gap-3">
                            <Clock className="h-5 w-5 text-gray-400" />
                            <div>
                                <div className="text-xs text-gray-500">Hours</div>
                                <div className="text-sm text-gray-900">{business.hours}</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Reviews Section */}
                <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Reviews</h2>
                        {business.reviews.length > 0 && (
                            <div className="flex items-center gap-2">
                                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                                <span className="text-lg font-semibold text-gray-900">
                                    {avgRating.toFixed(1)}
                                </span>
                                <span className="text-sm text-gray-500">
                                    ({business.reviews.length} {business.reviews.length === 1 ? 'review' : 'reviews'})
                                </span>
                            </div>
                        )}
                    </div>

                    {business.reviews.length === 0 ? (
                        <p className="text-sm text-gray-600 text-center py-8">
                            No reviews yet. Be the first to review this business!
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {business.reviews.map((review) => (
                                <Card key={review.id} className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <div className="font-medium text-gray-900">{review.user.name}</div>
                                            <div className="text-xs text-gray-500">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-4 w-4 ${
                                                        i < review.rating
                                                            ? "fill-amber-400 text-amber-400"
                                                            : "text-gray-300"
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    {review.comment && (
                                        <p className="text-sm text-gray-700">{review.comment}</p>
                                    )}
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
