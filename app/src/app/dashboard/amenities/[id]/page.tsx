import { verifySession } from "@/lib/session";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import BookingCalendar from "./booking-calendar";

export default async function AmenityDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const session = await verifySession();
    if (!session?.isAuth) redirect("/auth/login");

    const { id } = await params;

    const amenity = await db.amenity.findUnique({
        where: { id },
        include: {
            building: { select: { name: true } },
            bookings: {
                where: {
                    status: { in: ["confirmed", "pending"] },
                    startTime: { gte: new Date() },
                },
                orderBy: { startTime: "asc" },
                take: 10,
                include: {
                    user: { select: { name: true } },
                },
            },
        },
    });

    if (!amenity) {
        redirect("/dashboard/amenities");
    }

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
            {/* Back Button */}
            <Link
                href="/dashboard/amenities"
                className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
                ← Back to Amenities
            </Link>

            {/* Amenity Header */}
            <div className="bg-white border border-gray-200 rounded-lg p-8">
                <div className="flex items-start gap-6">
                    <span className="text-6xl">{amenityIcons[amenity.type] || "📍"}</span>
                    <div className="flex-1">
                        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                            {amenity.name}
                        </h1>
                        <p className="text-sm text-gray-600 mb-4">{amenity.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500">Capacity</span>
                                <p className="font-medium text-gray-900">
                                    {amenity.capacity || "N/A"}
                                </p>
                            </div>
                            <div>
                                <span className="text-gray-500">Booking Fee</span>
                                <p className="font-medium text-gray-900">
                                    ${amenity.bookingFee}
                                </p>
                            </div>
                            <div>
                                <span className="text-gray-500">Deposit</span>
                                <p className="font-medium text-gray-900">
                                    ${amenity.depositRequired}
                                </p>
                            </div>
                            <div>
                                <span className="text-gray-500">Max Duration</span>
                                <p className="font-medium text-gray-900">
                                    {amenity.maxBookingHours}h
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {amenity.rules && (
                    <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Rules</h3>
                        <p className="text-sm text-gray-700">{amenity.rules}</p>
                    </div>
                )}
            </div>

            {/* Booking Calendar */}
            <div className="bg-white border border-gray-200 rounded-lg p-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                    Book This Amenity
                </h2>
                <BookingCalendar
                    amenityId={amenity.id}
                    userId={session.userId}
                    buildingId={amenity.buildingId}
                    minHours={amenity.minBookingHours}
                    maxHours={amenity.maxBookingHours}
                    bookingFee={amenity.bookingFee}
                    depositRequired={amenity.depositRequired}
                    existingBookings={amenity.bookings.map((b) => ({
                        startTime: b.startTime.toISOString(),
                        endTime: b.endTime.toISOString(),
                    }))}
                />
            </div>

            {/* Upcoming Bookings */}
            {amenity.bookings.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">
                        Upcoming Bookings
                    </h2>
                    <div className="space-y-3">
                        {amenity.bookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                            >
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {new Date(booking.startTime).toLocaleDateString("en-AU", {
                                            weekday: "long",
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        {new Date(booking.startTime).toLocaleTimeString("en-AU", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}{" "}
                                        -{" "}
                                        {new Date(booking.endTime).toLocaleTimeString("en-AU", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
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
        </div>
    );
}
