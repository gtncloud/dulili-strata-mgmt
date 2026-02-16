import { verifySession } from "@/lib/session";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Shield, CheckCircle2, AlertTriangle, Clock, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function FireSafetyMeasuresPage() {
    const session = await verifySession();
    if (!session) redirect("/auth/login");

    const membership = await db.buildingMembership.findFirst({
        where: {
            userId: session.userId,
            status: "active",
        },
        include: {
            building: true,
        },
    });

    if (!membership) {
        return <div>No building membership found</div>;
    }

    // Fetch fire safety measures
    const measures = await db.fireSafetyMeasure.findMany({
        where: { buildingId: membership.buildingId },
        orderBy: { nextTestDue: "asc" },
    });

    // Calculate days until due
    const now = new Date();
    const measuresWithDays = measures.map(measure => {
        const daysUntilDue = Math.floor(
            (new Date(measure.nextTestDue).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );
        return { ...measure, daysUntilDue };
    });

    // Group by status
    const compliant = measuresWithDays.filter(m => m.status === "compliant" && m.daysUntilDue > 30);
    const dueSoon = measuresWithDays.filter(m => m.daysUntilDue > 0 && m.daysUntilDue <= 30);
    const overdue = measuresWithDays.filter(m => m.daysUntilDue <= 0 || m.status === "overdue");

    const getMeasureIcon = (type: string) => {
        const icons: Record<string, string> = {
            fire_alarm: "🔔",
            sprinkler: "💧",
            extinguisher: "🧯",
            exit_sign: "🚪",
            emergency_light: "💡",
            fire_door: "🚪",
            hose_reel: "🔥",
            smoke_detector: "💨",
        };
        return icons[type] || "🛡️";
    };

    const getStatusColor = (daysUntilDue: number, status: string) => {
        if (status === "overdue" || daysUntilDue <= 0) return "destructive";
        if (daysUntilDue <= 30) return "secondary";
        return "default";
    };

    const getStatusText = (daysUntilDue: number, status: string) => {
        if (status === "overdue" || daysUntilDue <= 0) return "Overdue";
        if (daysUntilDue <= 7) return `Due in ${daysUntilDue} days`;
        if (daysUntilDue <= 30) return "Due Soon";
        return "Compliant";
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/compliance/fire-safety">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Fire Safety Measures</h1>
                    <p className="text-gray-600 mt-2">
                        Track testing and maintenance of all fire safety equipment
                    </p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Total Measures
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">
                            {measures.length}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Compliant
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <div className="text-3xl font-bold text-green-600">
                                {compliant.length}
                            </div>
                            <CheckCircle2 className="h-6 w-6 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Due Soon
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <div className="text-3xl font-bold text-amber-600">
                                {dueSoon.length}
                            </div>
                            <Clock className="h-6 w-6 text-amber-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Overdue
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <div className="text-3xl font-bold text-red-600">
                                {overdue.length}
                            </div>
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Overdue Measures */}
            {overdue.length > 0 && (
                <Card className="border-red-200 bg-red-50">
                    <CardHeader>
                        <CardTitle className="text-red-900 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" />
                            Overdue Measures - Immediate Action Required
                        </CardTitle>
                        <CardDescription className="text-red-700">
                            These measures require immediate inspection and testing
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {overdue.map((measure) => (
                                <div key={measure.id} className="bg-white p-4 rounded-lg border border-red-200">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3">
                                            <div className="text-2xl">{getMeasureIcon(measure.measureType)}</div>
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {measure.measureType.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                                                </p>
                                                <p className="text-sm text-gray-600">{measure.location}</p>
                                                <div className="flex items-center gap-4 mt-2 text-sm">
                                                    <span className="text-gray-600">
                                                        Last tested: {measure.lastTested 
                                                            ? new Date(measure.lastTested).toLocaleDateString()
                                                            : "Never"}
                                                    </span>
                                                    <span className="text-red-600 font-medium">
                                                        Overdue by {Math.abs(measure.daysUntilDue)} days
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <Badge variant="destructive">Overdue</Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Due Soon Measures */}
            {dueSoon.length > 0 && (
                <Card className="border-amber-200 bg-amber-50">
                    <CardHeader>
                        <CardTitle className="text-amber-900 flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Due Soon (Next 30 Days)
                        </CardTitle>
                        <CardDescription className="text-amber-700">
                            Schedule inspections for these measures
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {dueSoon.map((measure) => (
                                <div key={measure.id} className="bg-white p-4 rounded-lg border border-amber-200">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3">
                                            <div className="text-2xl">{getMeasureIcon(measure.measureType)}</div>
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {measure.measureType.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                                                </p>
                                                <p className="text-sm text-gray-600">{measure.location}</p>
                                                <div className="flex items-center gap-4 mt-2 text-sm">
                                                    <span className="text-gray-600">
                                                        Due: {new Date(measure.nextTestDue).toLocaleDateString()}
                                                    </span>
                                                    <span className="text-amber-600 font-medium">
                                                        {measure.daysUntilDue} days remaining
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <Badge variant="secondary">Due Soon</Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* All Measures */}
            <Card>
                <CardHeader>
                    <CardTitle>All Fire Safety Measures</CardTitle>
                    <CardDescription>
                        Complete list of fire safety equipment and testing schedule
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {measuresWithDays.map((measure) => (
                            <div key={measure.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3 flex-1">
                                        <div className="text-2xl">{getMeasureIcon(measure.measureType)}</div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <p className="font-medium text-gray-900">
                                                    {measure.measureType.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                                                </p>
                                                <Badge variant={getStatusColor(measure.daysUntilDue, measure.status)}>
                                                    {getStatusText(measure.daysUntilDue, measure.status)}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">{measure.location}</p>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                                                <div>
                                                    <p className="text-gray-500">Standard</p>
                                                    <p className="font-medium">{measure.standard}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Testing Frequency</p>
                                                    <p className="font-medium capitalize">
                                                        {measure.testingFrequency.replace(/_/g, " ")}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Last Tested</p>
                                                    <p className="font-medium">
                                                        {measure.lastTested 
                                                            ? new Date(measure.lastTested).toLocaleDateString()
                                                            : "Never"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Next Test Due</p>
                                                    <p className="font-medium">
                                                        {new Date(measure.nextTestDue).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            {measure.notes && (
                                                <p className="text-sm text-gray-600 mt-2 italic">
                                                    Note: {measure.notes}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Testing Schedule Reference */}
            <Card>
                <CardHeader>
                    <CardTitle>Testing Frequency Reference</CardTitle>
                    <CardDescription>
                        AS1851-2012 standard testing requirements
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="font-medium text-gray-900">Monthly</p>
                            <p className="text-gray-600 mt-1">Emergency lighting, exit signs (basic check)</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="font-medium text-gray-900">Quarterly</p>
                            <p className="text-gray-600 mt-1">Fire extinguishers, hose reels (visual inspection)</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="font-medium text-gray-900">Semi-Annually</p>
                            <p className="text-gray-600 mt-1">Fire alarms, emergency lighting (full test)</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="font-medium text-gray-900">Annually</p>
                            <p className="text-gray-600 mt-1">Sprinklers, smoke detectors, fire doors</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
