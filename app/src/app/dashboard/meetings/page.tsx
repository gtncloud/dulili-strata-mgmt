import { db } from "@/lib/db";
import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, FileText, Plus, Clock } from "lucide-react";
import { format } from "date-fns";

export default async function MeetingsPage() {
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

  // Get all meetings for the building
  const meetings = await db.meeting.findMany({
    where: { buildingId: membership.buildingId },
    orderBy: { scheduledAt: "desc" },
    include: {
      _count: {
        select: { motions: true },
      },
    },
  });

  // Calculate stats
  const totalMeetings = meetings.length;
  const upcomingMeetings = meetings.filter(
    (m) => m.scheduledAt > new Date() && m.status === "scheduled"
  ).length;
  const completedMeetings = meetings.filter(
    (m) => m.status === "completed"
  ).length;

  // Check if user can create meetings (Manager or Committee)
  const canCreateMeeting = ["manager", "committee", "admin"].includes(
    membership.role
  );

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Meetings</h1>
          <p className="text-slate-600 mt-1">
            Manage AGMs, EGMs, and committee meetings
          </p>
        </div>
        {canCreateMeeting && (
          <Link href="/dashboard/meetings/new">
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Meeting
            </Button>
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-l-4 border-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Meetings</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">
                {totalMeetings}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-indigo-500" />
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Upcoming</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">
                {upcomingMeetings}
              </p>
            </div>
            <Clock className="h-8 w-8 text-emerald-500" />
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-slate-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Completed</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">
                {completedMeetings}
              </p>
            </div>
            <FileText className="h-8 w-8 text-slate-500" />
          </div>
        </Card>
      </div>

      {/* Meetings List */}
      <div className="space-y-4">
        {meetings.length === 0 ? (
          <Card className="p-12 text-center">
            <Calendar className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No meetings scheduled yet
            </h3>
            <p className="text-slate-600 mb-6">
              Schedule your first AGM, EGM, or committee meeting to get started.
            </p>
            {canCreateMeeting && (
              <Link href="/dashboard/meetings/new">
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>
              </Link>
            )}
          </Card>
        ) : (
          meetings.map((meeting) => {
            const isUpcoming = meeting.scheduledAt > new Date();
            const isPast = meeting.scheduledAt < new Date();

            return (
              <Link
                key={meeting.id}
                href={`/dashboard/meetings/${meeting.id}`}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-900">
                          {meeting.title}
                        </h3>
                        <Badge
                          variant={
                            meeting.type === "agm"
                              ? "default"
                              : meeting.type === "egm"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {meeting.type.toUpperCase()}
                        </Badge>
                        <Badge
                          variant={
                            meeting.status === "scheduled"
                              ? "default"
                              : meeting.status === "completed"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {meeting.status}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-slate-600 mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {format(meeting.scheduledAt, "PPP")}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {format(meeting.scheduledAt, "p")}
                        </div>
                        {meeting.location && (
                          <div className="flex items-center gap-2">
                            📍 {meeting.location}
                          </div>
                        )}
                      </div>

                      {meeting.description && (
                        <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                          {meeting.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {meeting._count.motions} motion
                          {meeting._count.motions !== 1 ? "s" : ""}
                        </div>
                        {meeting.quorum && (
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            Quorum: {meeting.quorum}
                          </div>
                        )}
                      </div>
                    </div>

                    {isUpcoming && (
                      <div className="ml-4">
                        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                          Upcoming
                        </Badge>
                      </div>
                    )}
                    {isPast && meeting.status !== "completed" && (
                      <div className="ml-4">
                        <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                          Pending Minutes
                        </Badge>
                      </div>
                    )}
                  </div>
                </Card>
              </Link>
            );
          })
        )}
      </div>

      {/* Australian Compliance Info */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
          🇦🇺 Australian Strata Meeting Requirements
        </h3>
        <div className="text-sm text-slate-700 space-y-2">
          <p>
            <strong>AGM (Annual General Meeting):</strong> Must be held within
            2 months after the end of the financial year (Section 18)
          </p>
          <p>
            <strong>EGM (Extraordinary General Meeting):</strong> Can be called
            by the committee or by owners with at least 25% of unit entitlements
            (Section 20)
          </p>
          <p>
            <strong>Notice Period:</strong> At least 14 days notice required for
            AGM/EGM, 3 days for committee meetings (Section 19)
          </p>
          <p>
            <strong>Quorum:</strong> AGM/EGM requires owners with at least 25%
            of unit entitlements, committee meetings require majority of
            committee members (Section 24)
          </p>
          <p>
            <strong>Minutes:</strong> Must be kept for all meetings and made
            available to owners (Section 42)
          </p>
          <p className="text-xs text-slate-600 mt-3">
            Reference: NSW Strata Schemes Management Act 2015
          </p>
        </div>
      </Card>
    </div>
  );
}
