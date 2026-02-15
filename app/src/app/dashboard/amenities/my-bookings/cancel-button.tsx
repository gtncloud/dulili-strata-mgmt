"use client";

import { useState } from "react";
import { cancelBooking } from "../[id]/actions";

export default function CancelBookingButton({ bookingId }: { bookingId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [reason, setReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCancel = async () => {
        setIsSubmitting(true);
        const result = await cancelBooking(bookingId, reason);
        if (result.success) {
            window.location.reload();
        } else {
            alert(result.error);
            setIsSubmitting(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="text-xs text-red-600 hover:text-red-700 font-medium"
            >
                Cancel Booking
            </button>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cancel Booking</h3>
                <p className="text-sm text-gray-600 mb-4">
                    Are you sure you want to cancel this booking? This action cannot be undone.
                </p>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reason (optional)
                    </label>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                        placeholder="Why are you cancelling?"
                    />
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsOpen(false)}
                        disabled={isSubmitting}
                        className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                    >
                        Keep Booking
                    </button>
                    <button
                        onClick={handleCancel}
                        disabled={isSubmitting}
                        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                        {isSubmitting ? "Cancelling..." : "Cancel Booking"}
                    </button>
                </div>
            </div>
        </div>
    );
}
