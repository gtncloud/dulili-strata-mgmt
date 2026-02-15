import { verifySession } from "@/lib/session";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import CancelBookingButton from "./cancel-button";

export default async function MyBookingsPage() {
    const session = await verifySession();
    if (!session?.isAuth) redirect("/auth/login");

    const bookings = await db.amenityBooking.findMany({
        where: { userId: session.userId },
        include: {
            amenity: { select: { name: true, type: true } },
        },
        orderBy: { startTime: "desc" },
    });

    const upcomingBookings = bookings.filter(
        (b) => b.startTime >= new Date() && b.status !== "cancelled"
    );
    const pastBookings = bookings.filter(
        (b) => b.startTime < new Date() || b.status === "cancelled"
    );

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

    const statusColors: Record<string, string> = {
        pending: "bg-yellow-100 text-yellow-700",
        confirmed: "bg-green-100 text-green-700",
        cancelled: "bg-red-100 text-red-700",
        completed: "bg-gray-100 text-gray-700",
    };

    return (
        <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">My Bookings</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        View and manage your amenity bookings
                    </p>
                </div>
                <Link
                    href="/dashboard/amenities"
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors"
                >
                    Browse Amenities
                </Link>
            </div>

            {/* Upcoming Bookings */}
            <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Bookings</h2>
                {upcomingBookings.length > 0 ? (
                    <div className="space-y-4">
                        {upcomingBookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="bg-white border border-gray-200 rounded-lg p-6"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4 flex-1">
                                        <span className="text-3xl">
                                            {amenityIcons[booking.amenity.type] || "📍"}
                                        </span>
                                        <div className="flex-1">
                                            <h3 className="text-base font-semibold text-gray-900 mb-1">
                                                {booking.amenity.name}
                                            </h3>
                                            <div className="space-y-1 text-sm text-gray-600">
                                                <p>
                                                    📅{" "}
                                                    {new Date(booking.startTime).toLocaleDateString(
                                                        "en-AU",
                                                        {
                                                            weekday: "long",
                                                            day: "numeric",
                                                            month: "long",
                                                            year: "numeric",
                                                        }
                                                    )}
                                                </p>
                                                <p>
                                                    🕐{" "}
                                                    {new Date(booking.startTime).toLocaleTimeString(
                                                        "en-AU",
                                                        {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        }
                                                    )}{" "}
                                                    -{" "}
                                                    {new Date(booking.endTime).toLocaleTimeString(
                                                        "en-AU",
                                                        {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        }
                                                    )}
                                                </p>
                                                {booking.purpose && <p>📝 {booking.purpose}</p>}
                                                {booking.guestCount && (
                                                    <p>👥 {booking.guestCount} guests</p>
                                                )}
                                            </div>
                                            {booking.totalFee > 0 && (
                                                <div className="mt-3 text-sm">
                                                    <span className="text-gray-600">Total: </span>
                                                    <span className="font-semibold text-gray-900">
                                                        ${booking.totalFee}
                                                    </span>
                                                    {booking.depositPaid > 0 && (
                                                        <span className="text-gray-600">
                                                            {" "}
                                                            (+ ${booking.depositPaid} deposit)
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-3">
                                        <span
                                            className={`px-2 py-1 text-xs font-medium rounded ${
                                                statusColors[booking.status]
                                            }`}
                                        >
                                            {booking.status}
                                        </span>
                                        {booking.status === "confirmed" && (
                                            <CancelBookingButton bookingId={booking.id} />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <p className="text-gray-600 mb-4">No upcoming bookings</p>
                        <Link
                            href="/dashboard/amenities"
                            className="text-amber-600 hover:text-amber-700 text-sm font-medium"
                        >
                            Browse available amenities →
                        </Link>
                    </div>
                )}
            </div>

            {/* Past Bookings */}
            {pastBookings.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Past Bookings</h2>
                    <div className="space-y-4">
                        {pastBookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="bg-gray-50 border border-gray-200 rounded-lg p-6 opacity-75"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4 flex-1">
                                        <span className="text-3xl">
                                            {amenityIcons[booking.amenity.type] || "📍"}
                                        </span>
                                        <div className="flex-1">
                                            <h3 className="text-base font-semibold text-gray-900 mb-1">
                                                {booking.amenity.name}
                                            </h3>
                                            <div className="space-y-1 text-sm text-gray-600">
                                                <p>
                                                    📅{" "}
                                                    {new Date(booking.startTime).toLocaleDateString(
                                                        "en-AU",
                                                        {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric",
                                                        }
                                                    )}
                                                </p>
                                                {booking.cancelReason && (
                                                    <p className="text-red-600">
                                                        Cancelled: {booking.cancelReason}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <span
                                        className={`px-2 py-1 text-xs font-medium rounded ${
                                            statusColors[booking.status]
                                        }`}
                                    >
                                        {booking.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
