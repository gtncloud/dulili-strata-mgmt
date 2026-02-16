import { verifySession } from "@/lib/session";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
    AlertTriangle, 
    CheckCircle2, 
    Clock, 
    FileText, 
    Shield,
    Calendar,
    AlertCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function FireSafetyPage() {
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

    // Fetch fire safety data
    const [measures, afssStatements, emergencyPlan, upcomingInspections] = await Promise.all([
        db.fireSafetyMeasure.findMany({
            where: { buildingId: membership.buildingId },
            orderBy: { nextTestDue: "asc" },
        }),
        db.annualFireSafetyStatement.findMany({
            where: { buildingId: membership.buildingId },
            orderBy: { year: "desc" },
            take: 3,
        }),
        db.emergencyPlan.findFirst({
            where: { buildingId: membership.buildingId },
            orderBy: { approvedDate: "desc" },
        }),
        db.fireSafetyInspection.findMany({
            where: {
                buildingId: membership.buildingId,
                inspectionDate: {
                    gte: new Date(),
                },
            },
            orderBy: { inspectionDate: "asc" },
            take: 5,
        }),
    ]);

    // Calculate statistics
    const now = new Date();
    const compliantMeasures = measures.filter(m => m.status === "compliant").length;
    const overdueMeasures = measures.filter(m => m.status === "overdue" || new Date(m.nextTestDue) < now).length;
    const dueSoonMeasures = measures.filter(m => {
        const daysUntilDue = Math.floor((new Date(m.nextTestDue).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilDue > 0 && daysUntilDue <= 30 && m.status !== "overdue";
    }).length;

    const currentYear = now.getFullYear();
    const currentAFSS = afssStatements.find(s => s.year === currentYear);
    const afssStatus = currentAFSS?.status || "not_created";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Fire Safety Compliance</h1>
                <p className="text-gray-600 mt-2">
                    Manage fire safety measures, AFSS submissions, and emergency planning
                </p>
            </div>

            {/* Compliance Disclaimer */}
            <Card className="border-amber-200 bg-amber-50">
                <CardContent className="pt-6">
                    <div className="flex gap-3">
                        <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-amber-800">
                            <p className="font-medium mb-1">Compliance Notice</p>
                            <p>
                                Dulili's Fire Safety Compliance module is a record-keeping and tracking tool. 
                                It does not replace the requirement for physical fire safety systems, accredited 
                                practitioner assessments, or compliance with AS1851-2012. Building owners remain 
                                responsible for all fire safety obligations under NSW law.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Compliant Measures
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="text-3xl font-bold text-green-600">
                                {compliantMeasures}
                            </div>
                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                            of {measures.length} total measures
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Overdue Items
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="text-3xl font-bold text-red-600">
                                {overdueMeasures}
                            </div>
                            <AlertTriangle className="h-8 w-8 text-red-600" />
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                            Require immediate attention
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Due Soon (30 days)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="text-3xl font-bold text-amber-600">
                                {dueSoonMeasures}
                            </div>
                            <Clock className="h-8 w-8 text-amber-600" />
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                            Schedule inspections soon
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            {currentYear} AFSS Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <Badge 
                                variant={
                                    afssStatus === "submitted" ? "default" :
                                    afssStatus === "draft" ? "secondary" :
                                    "destructive"
                                }
                                className="text-sm"
                            >
                                {afssStatus === "submitted" ? "Submitted" :
                                 afssStatus === "draft" ? "Draft" :
                                 "Not Created"}
                            </Badge>
                            <FileText className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                            Annual statement
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                        Common fire safety compliance tasks
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link href="/dashboard/compliance/fire-safety/afss">
                            <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
                                <FileText className="h-6 w-6" />
                                <span>Manage AFSS</span>
                            </Button>
                        </Link>
                        <Link href="/dashboard/compliance/fire-safety/measures">
                            <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
                                <Shield className="h-6 w-6" />
                                <span>Fire Safety Measures</span>
                            </Button>
                        </Link>
                        <Link href="/dashboard/compliance/fire-safety/emergency-plan">
                            <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
                                <AlertTriangle className="h-6 w-6" />
                                <span>Emergency Plan</span>
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* Recent AFSS */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Annual Fire Safety Statements</CardTitle>
                            <CardDescription>Recent AFSS submissions</CardDescription>
                        </div>
                        <Link href="/dashboard/compliance/fire-safety/afss">
                            <Button variant="outline" size="sm">View All</Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    {afssStatements.length === 0 ? (
                        <p className="text-gray-600 text-center py-8">
                            No AFSS records found. Create your first statement.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {afssStatements.map((afss) => (
                                <div key={afss.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <Calendar className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="font-medium">AFSS {afss.year}</p>
                                            <p className="text-sm text-gray-600">
                                                Due: {new Date(afss.dueDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge 
                                            variant={
                                                afss.status === "submitted" ? "default" :
                                                afss.status === "draft" ? "secondary" :
                                                "destructive"
                                            }
                                        >
                                            {afss.status}
                                        </Badge>
                                        {afss.submittedToCouncil && afss.submittedToFireRescue && (
                                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Emergency Plan Status */}
            {emergencyPlan && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Emergency Plan</CardTitle>
                                <CardDescription>Current emergency procedures</CardDescription>
                            </div>
                            <Link href="/dashboard/compliance/fire-safety/emergency-plan">
                                <Button variant="outline" size="sm">View Plan</Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Version</p>
                                <p className="font-medium">{emergencyPlan.version}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Last Drill</p>
                                <p className="font-medium">
                                    {emergencyPlan.lastDrillDate 
                                        ? new Date(emergencyPlan.lastDrillDate).toLocaleDateString()
                                        : "No drill recorded"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Next Drill Due</p>
                                <p className="font-medium">
                                    {new Date(emergencyPlan.nextDrillDue).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
