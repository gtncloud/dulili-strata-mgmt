import { db } from "@/lib/db";
import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";
import { MeetingForm } from "./meeting-form";

export default async function NewMeetingPage() {
  const session = await verifySession();

  // Get user's building membership
  const membership = await db.buildingMembership.findFirst({
    where: { userId: session.userId },
    include: { building: true },
  });

  if (!membership) {
    return (
      <div className="p-8">
        <p className="text-slate-600">No building membership found.</p>
      </div>
    );
  }

  // Check if user can create meetings
  if (!["manager", "committee", "admin"].includes(membership.role)) {
    return (
      <div className="p-8">
        <p className="text-slate-600">
          You don't have permission to schedule meetings.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Schedule Meeting</h1>
        <p className="text-slate-600 mt-1">
          Create a new AGM, EGM, or committee meeting
        </p>
      </div>

      <MeetingForm buildingId={membership.buildingId} />
    </div>
  );
}
