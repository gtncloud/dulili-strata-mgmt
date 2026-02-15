"use client";

import { useState } from "react";
import { createBooking } from "./actions";

interface BookingCalendarProps {
    amenityId: string;
    userId: string;
    buildingId: string;
    minHours: number;
    maxHours: number;
    bookingFee: number;
    depositRequired: number;
    existingBookings: Array<{ startTime: string; endTime: string }>;
}

export default function BookingCalendar({
    amenityId,
    userId,
    buildingId,
    minHours,
    maxHours,
    bookingFee,
    depositRequired,
    existingBookings,
}: BookingCalendarProps) {
    const [selectedDate, setSelectedDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [duration, setDuration] = useState(minHours);
    const [purpose, setPurpose] = useState("");
    const [guestCount, setGuestCount] = useState<number | undefined>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
        null
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(null);

        try {
            const startDateTime = new Date(`${selectedDate}T${startTime}`);
            const endDateTime = new Date(startDateTime);
            endDateTime.setHours(endDateTime.getHours() + duration);

            const result = await createBooking({
                amenityId,
                userId,
                buildingId,
                startTime: startDateTime,
                endTime: endDateTime,
                purpose,
                guestCount,
                totalFee: bookingFee,
                depositPaid: depositRequired,
            });

            if (result.success) {
                setMessage({ type: "success", text: "Booking created successfully!" });
                setSelectedDate("");
                setStartTime("");
                setPurpose("");
                setGuestCount(undefined);
                setTimeout(() => window.location.reload(), 1500);
            } else {
                setMessage({ type: "error", text: result.error || "Failed to create booking" });
            }
        } catch (error) {
            setMessage({ type: "error", text: "An error occurred" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const totalCost = bookingFee + depositRequired;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date
                    </label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Time
                    </label>
                    <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration (hours)
                    </label>
                    <select
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                    >
                        {Array.from({ length: maxHours - minHours + 1 }, (_, i) => minHours + i).map(
                            (hours) => (
                                <option key={hours} value={hours}>
                                    {hours} {hours === 1 ? "hour" : "hours"}
                                </option>
                            )
                        )}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Guests (optional)
                    </label>
                    <input
                        type="number"
                        value={guestCount || ""}
                        onChange={(e) =>
                            setGuestCount(e.target.value ? Number(e.target.value) : undefined)
                        }
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purpose (optional)
                </label>
                <textarea
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                    placeholder="e.g., Birthday party, Family gathering"
                />
            </div>

            {totalCost > 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Cost Summary</h3>
                    <div className="space-y-1 text-sm">
                        {bookingFee > 0 && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">Booking Fee</span>
                                <span className="font-medium">${bookingFee}</span>
                            </div>
                        )}
                        {depositRequired > 0 && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">Refundable Deposit</span>
                                <span className="font-medium">${depositRequired}</span>
                            </div>
                        )}
                        <div className="flex justify-between pt-2 border-t border-gray-200">
                            <span className="font-semibold text-gray-900">Total</span>
                            <span className="font-semibold text-gray-900">${totalCost}</span>
                        </div>
                    </div>
                </div>
            )}

            {message && (
                <div
                    className={`p-4 rounded-lg ${
                        message.type === "success"
                            ? "bg-green-50 text-green-800 border border-green-200"
                            : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                >
                    {message.text}
                </div>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-3 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {isSubmitting ? "Creating Booking..." : "Create Booking"}
            </button>
        </form>
    );
}
