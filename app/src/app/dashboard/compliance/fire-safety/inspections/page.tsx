import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";
import { db as prisma } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, Calendar, CheckCircle, AlertTriangle, XCircle, Upload, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function FireSafetyInspectionsPage() {
    const session = await verifySession();
    if (!session) redirect("/auth/login");

    // Get user's building
    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        include: { building: true }
    });

    if (!user?.buildingId) {
        return <div>No building assigned</div>;
    }

    // Get all fire safety measures
    const measures = await prisma.fireSafetyMeasure.findMany({
        where: { schedule: { buildingId: user.buildingId } },
        include: { schedule: true },
        orderBy: { nextTestDue: 'asc' }
    });

    // Get recent inspections
    const inspections = await prisma.fireSafetyInspection.findMany({
        where: { buildingId: user.buildingId },
        include: { measure: true },
        orderBy: { inspectionDate: 'desc' },
        take: 10
    });

    // Calculate statistics
    const totalInspections = inspections.length;
    const passedInspections = inspections.filter(i => i.result === 'pass').length;
    const failedInspections = inspections.filter(i => i.result === 'fail').length;
    const requiresAttention = inspections.filter(i => i.result === 'requires_attention').length;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/compliance/fire-safety">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Fire Safety
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Fire Safety Inspections</h1>
                        <p className="text-sm text-gray-500">Schedule and record fire safety inspections</p>
                    </div>
                </div>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Inspection
                </Button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Total Inspections</CardDescription>
                        <CardTitle className="text-3xl">{totalInspections}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Passed</CardDescription>
                        <CardTitle className="text-3xl text-green-600">{passedInspections}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Failed</CardDescription>
                        <CardTitle className="text-3xl text-red-600">{failedInspections}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Requires Attention</CardDescription>
                        <CardTitle className="text-3xl text-amber-600">{requiresAttention}</CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Upcoming Inspections */}
            <Card>
                <CardHeader>
                    <CardTitle>Upcoming Inspections</CardTitle>
                    <CardDescription>Fire safety measures due for testing</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {measures.slice(0, 5).map((measure) => {
                            const daysUntilDue = Math.ceil(
                                (new Date(measure.nextTestDue).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                            );
                            const isOverdue = daysUntilDue < 0;
                            const isDueSoon = daysUntilDue >= 0 && daysUntilDue <= 30;

                            return (
                                <div key={measure.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-medium text-gray-900 capitalize">
                                                {measure.measureType.replace(/_/g, ' ')}
                                            </h3>
                                            {isOverdue && (
                                                <Badge variant="destructive">Overdue</Badge>
                                            )}
                                            {isDueSoon && !isOverdue && (
                                                <Badge className="bg-amber-100 text-amber-800">Due Soon</Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500">{measure.location}</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Testing: {measure.testingFrequency} | Standard: {measure.standard}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900">
                                            {new Date(measure.nextTestDue).toLocaleDateString()}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {isOverdue ? `${Math.abs(daysUntilDue)} days overdue` : `${daysUntilDue} days`}
                                        </p>
                                        <Button size="sm" className="mt-2">
                                            <Calendar className="h-3 w-3 mr-1" />
                                            Schedule
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Recent Inspections */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Inspections</CardTitle>
                    <CardDescription>Latest inspection records</CardDescription>
                </CardHeader>
                <CardContent>
                    {inspections.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <p>No inspections recorded yet</p>
                            <Button className="mt-4">
                                <Plus className="h-4 w-4 mr-2" />
                                Record First Inspection
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {inspections.map((inspection) => {
                                const resultConfig = {
                                    pass: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', label: 'Passed' },
                                    fail: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', label: 'Failed' },
                                    requires_attention: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50', label: 'Requires Attention' }
                                };
                                const config = resultConfig[inspection.result as keyof typeof resultConfig];
                                const ResultIcon = config.icon;

                                return (
                                    <div key={inspection.id} className={`p-4 border rounded-lg ${config.bg}`}>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <ResultIcon className={`h-5 w-5 ${config.color}`} />
                                                    <h3 className="font-medium text-gray-900 capitalize">
                                                        {inspection.measure.measureType.replace(/_/g, ' ')}
                                                    </h3>
                                                    <Badge className={config.bg}>{config.label}</Badge>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">{inspection.measure.location}</p>
                                                <div className="mt-2 text-sm text-gray-700">
                                                    <p><span className="font-medium">Inspector:</span> {inspection.inspectorName}</p>
                                                    <p><span className="font-medium">Date:</span> {new Date(inspection.inspectionDate).toLocaleDateString()}</p>
                                                    {inspection.findings && (
                                                        <p className="mt-1"><span className="font-medium">Findings:</span> {inspection.findings}</p>
                                                    )}
                                                    {inspection.correctiveActions && (
                                                        <p className="mt-1"><span className="font-medium">Corrective Actions:</span> {inspection.correctiveActions}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500">Next inspection</p>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {new Date(inspection.nextInspectionDue).toLocaleDateString()}
                                                </p>
                                                {inspection.certificateUrl && (
                                                    <Button size="sm" variant="outline" className="mt-2">
                                                        <Upload className="h-3 w-3 mr-1" />
                                                        View Certificate
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Compliance Notice */}
            <Card className="border-blue-200 bg-blue-50">
                <CardContent className="pt-6">
                    <div className="flex gap-3">
                        <AlertTriangle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-900">
                            <p className="font-medium mb-1">AS1851-2012 Compliance</p>
                            <p>All fire safety inspections must be conducted by qualified technicians in accordance with AS1851-2012 standards. Keep all inspection certificates for AFSS submission.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
