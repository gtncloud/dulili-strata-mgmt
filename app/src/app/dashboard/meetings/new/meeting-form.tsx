"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, MapPin, Users, FileText } from "lucide-react";
import { createMeeting } from "./actions";

interface MeetingFormProps {
  buildingId: string;
}

export function MeetingForm({ buildingId }: MeetingFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedType, setSelectedType] = useState<"agm" | "egm" | "committee">("agm");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const result = await createMeeting(formData);

    if (result.success) {
      router.push("/dashboard/meetings");
      router.refresh();
    } else {
      alert(result.error || "Failed to create meeting");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input type="hidden" name="buildingId" value={buildingId} />

      {/* Meeting Type Selection */}
      <Card className="p-6">
        <Label className="text-base font-semibold mb-4 block">
          Meeting Type *
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => setSelectedType("agm")}
            className={`p-6 rounded-lg border-2 transition-all text-left ${
              selectedType === "agm"
                ? "border-amber-500 bg-amber-50"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="text-2xl mb-2">📅</div>
            <div className="font-semibold text-slate-900 mb-1">AGM</div>
            <div className="text-sm text-slate-600">
              Annual General Meeting
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedType("egm")}
            className={`p-6 rounded-lg border-2 transition-all text-left ${
              selectedType === "egm"
                ? "border-amber-500 bg-amber-50"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="text-2xl mb-2">⚡</div>
            <div className="font-semibold text-slate-900 mb-1">EGM</div>
            <div className="text-sm text-slate-600">
              Extraordinary General Meeting
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedType("committee")}
            className={`p-6 rounded-lg border-2 transition-all text-left ${
              selectedType === "committee"
                ? "border-amber-500 bg-amber-50"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="text-2xl mb-2">👥</div>
            <div className="font-semibold text-slate-900 mb-1">Committee</div>
            <div className="text-sm text-slate-600">Committee Meeting</div>
          </button>
        </div>
        <input type="hidden" name="type" value={selectedType} />
      </Card>

      {/* Meeting Details */}
      <Card className="p-6 space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-amber-600" />
          <h3 className="text-lg font-semibold text-slate-900">
            Meeting Details
          </h3>
        </div>

        <div>
          <Label htmlFor="title">Meeting Title *</Label>
          <Input
            id="title"
            name="title"
            placeholder={
              selectedType === "agm"
                ? "Annual General Meeting 2026"
                : selectedType === "egm"
                ? "Extraordinary General Meeting - [Topic]"
                : "Committee Meeting - [Date]"
            }
            required
            className="mt-1.5"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="date" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Date *
            </Label>
            <Input
              id="date"
              name="date"
              type="date"
              required
              className="mt-1.5"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div>
            <Label htmlFor="time" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Time *
            </Label>
            <Input
              id="time"
              name="time"
              type="time"
              required
              className="mt-1.5"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="location" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Location *
          </Label>
          <Input
            id="location"
            name="location"
            placeholder="Building common area, online meeting link, etc."
            required
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="description">Description / Agenda</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Meeting agenda, topics to be discussed, etc."
            rows={6}
            className="mt-1.5"
          />
        </div>

        {selectedType !== "committee" && (
          <div>
            <Label htmlFor="quorum" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Quorum
            </Label>
            <Input
              id="quorum"
              name="quorum"
              type="number"
              placeholder="Minimum number of attendees required"
              className="mt-1.5"
            />
            <p className="text-sm text-slate-500 mt-1.5">
              {selectedType === "agm" || selectedType === "egm"
                ? "AGM/EGM requires owners with at least 25% of unit entitlements"
                : ""}
            </p>
          </div>
        )}
      </Card>

      {/* Notice Requirements */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
          📋 Notice Requirements
        </h3>
        <div className="text-sm text-slate-700 space-y-2">
          {selectedType === "agm" || selectedType === "egm" ? (
            <>
              <p>
                <strong>Notice Period:</strong> At least 14 days notice must be
                given to all owners
              </p>
              <p>
                <strong>Notice Content:</strong> Must include date, time,
                location, and agenda
              </p>
              <p>
                <strong>Delivery:</strong> Notice can be sent by email, post, or
                displayed on noticeboard
              </p>
            </>
          ) : (
            <>
              <p>
                <strong>Notice Period:</strong> At least 3 days notice for
                committee meetings
              </p>
              <p>
                <strong>Notice Content:</strong> Must include date, time, and
                location
              </p>
            </>
          )}
          <p className="text-xs text-slate-600 mt-2">
            Reference: NSW Strata Schemes Management Act 2015, Section 19
          </p>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        >
          {isSubmitting ? "Scheduling..." : "Schedule Meeting"}
        </Button>
      </div>
    </form>
  );
}
