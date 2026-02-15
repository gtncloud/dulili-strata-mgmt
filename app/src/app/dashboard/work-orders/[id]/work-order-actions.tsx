"use client";

import { useState } from "react";
import { updateWorkOrder, assignWorkOrder, addWorkLog } from "./actions";
import { useRouter } from "next/navigation";

interface WorkOrderActionsProps {
    requestId: string;
    currentStatus: string;
    currentAssignedTo: string | null;
    userId: string;
    maintenanceStaff: Array<{ id: string; name: string }>;
}

export default function WorkOrderActions({
    requestId,
    currentStatus,
    currentAssignedTo,
    userId,
    maintenanceStaff,
}: WorkOrderActionsProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showNoteForm, setShowNoteForm] = useState(false);
    const [note, setNote] = useState("");
    const [hoursWorked, setHoursWorked] = useState("");

    const handleStatusChange = async (newStatus: string) => {
        setIsSubmitting(true);
        const result = await updateWorkOrder(requestId, userId, {
            status: newStatus,
        });
        if (result.success) {
            router.refresh();
        }
        setIsSubmitting(false);
    };

    const handleAssign = async (assignToId: string) => {
        setIsSubmitting(true);
        const result = await assignWorkOrder(requestId, userId, assignToId);
        if (result.success) {
            router.refresh();
        }
        setIsSubmitting(false);
    };

    const handleAddNote = async () => {
        if (!note.trim()) return;
        setIsSubmitting(true);
        const result = await addWorkLog(requestId, userId, {
            action: "note_added",
            notes: note,
            hoursWorked: hoursWorked ? parseFloat(hoursWorked) : undefined,
        });
        if (result.success) {
            setNote("");
            setHoursWorked("");
            setShowNoteForm(false);
            router.refresh();
        }
        setIsSubmitting(false);
    };

    const statusActions: Record<string, Array<{ label: string; value: string; color: string }>> = {
        submitted: [
            { label: "Review", value: "reviewed", color: "bg-purple-500" },
            { label: "Start Work", value: "in_progress", color: "bg-amber-500" },
        ],
        reviewed: [
            { label: "Start Work", value: "in_progress", color: "bg-amber-500" },
        ],
        in_progress: [
            { label: "Mark Resolved", value: "resolved", color: "bg-green-500" },
        ],
        resolved: [
            { label: "Close", value: "closed", color: "bg-gray-500" },
            { label: "Reopen", value: "in_progress", color: "bg-amber-500" },
        ],
        closed: [
            { label: "Reopen", value: "in_progress", color: "bg-amber-500" },
        ],
    };

    const availableActions = statusActions[currentStatus] || [];

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
            <h2 className="text-base font-semibold text-gray-900">Actions</h2>

            {/* Assign */}
            {!currentAssignedTo && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Assign To
                    </label>
                    <select
                        onChange={(e) => handleAssign(e.target.value)}
                        disabled={isSubmitting}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                    >
                        <option value="">Select staff member...</option>
                        {maintenanceStaff.map((staff) => (
                            <option key={staff.id} value={staff.id}>
                                {staff.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Status Actions */}
            {availableActions.length > 0 && (
                <div className="space-y-2">
                    {availableActions.map((action) => (
                        <button
                            key={action.value}
                            onClick={() => handleStatusChange(action.value)}
                            disabled={isSubmitting}
                            className={`w-full px-4 py-2 text-sm font-medium text-white ${action.color} rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                        >
                            {action.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Add Note */}
            {!showNoteForm ? (
                <button
                    onClick={() => setShowNoteForm(true)}
                    className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Add Work Note
                </button>
            ) : (
                <div className="space-y-3">
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Describe the work performed..."
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                    />
                    <input
                        type="number"
                        value={hoursWorked}
                        onChange={(e) => setHoursWorked(e.target.value)}
                        placeholder="Hours worked (optional)"
                        step="0.5"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                setShowNoteForm(false);
                                setNote("");
                                setHoursWorked("");
                            }}
                            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAddNote}
                            disabled={isSubmitting || !note.trim()}
                            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSubmitting ? "Adding..." : "Add Note"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
