import { verifySession } from "@/lib/session";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AmenitiesPage() {
    const session = await verifySession();
    if (!session?.isAuth) redirect("/auth/login");

    const amenities = await db.amenity.findMany({
        where: { isActive: true },
        include: {
            building: { select: { name: true } },
            _count: { select: { bookings: true } },
        },
        orderBy: { name: "asc" },
    });

    const myBookings = await db.amenityBooking.findMany({
        where: {
            userId: session.userId,
            status: { in: ["pending", "confirmed"] },
            startTime: { gte: new Date() },
        },
        include: {
            amenity: { select: { name: true, type: true } },
        },
        orderBy: { startTime: "asc" },
        take: 5,
    });

    const amenityIcons: Record<string, string> = {
        gym: "💪",
        pool: "🏊",
        bbq: "🍖",
        party_room: "🎉",
        guest_suite: "🛏️",
        tennis_court: "🎾",
        meeting_room: "👥",
        other: "📍",
    };

    return (
        <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Amenities</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Book shared facilities and amenities
                    </p>
                </div>
                <Link
                    href="/dashboard/amenities/my-bookings"
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors"
                >
                    My Bookings
                </Link>
            </div>

            {/* My Upcoming Bookings */}
            {myBookings.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                    <h2 className="text-base font-semibold text-gray-900 mb-4">
                        Your Upcoming Bookings
                    </h2>
                    <div className="space-y-3">
                        {myBookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="flex items-center justify-between bg-white rounded-lg p-4"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">
                                        {amenityIcons[booking.amenity.type] || "📍"}
                                    </span>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {booking.amenity.name}
                                        </p>
                                        <p className="text-xs text-gray-600">
                                            {new Date(booking.startTime).toLocaleDateString("en-AU", {
                                                weekday: "short",
                                                day: "numeric",
                                                month: "short",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <span
                                    className={`px-2 py-1 text-xs font-medium rounded ${
                                        booking.status === "confirmed"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-yellow-100 text-yellow-700"
                                    }`}
                                >
                                    {booking.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Amenities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {amenities.map((amenity) => (
                    <Link
                        key={amenity.id}
                        href={`/dashboard/amenities/${amenity.id}`}
                        className="bg-white border border-gray-200 rounded-lg p-6 hover:border-amber-300 hover:shadow-md transition-all"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <span className="text-4xl">
                                {amenityIcons[amenity.type] || "📍"}
                            </span>
                            {amenity.bookingFee > 0 && (
                                <span className="text-sm font-semibold text-amber-600">
                                    ${amenity.bookingFee}
                                </span>
                            )}
                        </div>
                        <h3 className="text-base font-semibold text-gray-900 mb-2">
                            {amenity.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                            {amenity.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Capacity: {amenity.capacity || "N/A"}</span>
                            <span>{amenity._count.bookings} bookings</span>
                        </div>
                    </Link>
                ))}
            </div>

            {amenities.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">No amenities available</p>
                </div>
            )}
        </div>
    );
}
