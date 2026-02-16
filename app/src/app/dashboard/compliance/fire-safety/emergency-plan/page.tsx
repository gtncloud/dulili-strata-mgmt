import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";
import { db as prisma } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, AlertTriangle, MapPin, Phone, FileText, Calendar, Edit } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function EmergencyPlanPage() {
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

    // Get emergency plan
    const emergencyPlan = await prisma.emergencyPlan.findFirst({
        where: { buildingId: user.buildingId },
        orderBy: { approvedDate: 'desc' }
    });

    if (!emergencyPlan) {
        return (
            <div className="p-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/dashboard/compliance/fire-safety">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Fire Safety
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Emergency Plan</h1>
                        <p className="text-sm text-gray-500">Building emergency response procedures</p>
                    </div>
                </div>
                <Card>
                    <CardContent className="pt-6 text-center py-12">
                        <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">No emergency plan found</p>
                        <Button>
                            <FileText className="h-4 w-4 mr-2" />
                            Create Emergency Plan
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const assemblyPoints = JSON.parse(emergencyPlan.assemblyPoints);
    const emergencyContacts = JSON.parse(emergencyPlan.emergencyContacts);

    // Calculate days since last drill
    const daysSinceLastDrill = emergencyPlan.lastDrillDate
        ? Math.floor((new Date().getTime() - new Date(emergencyPlan.lastDrillDate).getTime()) / (1000 * 60 * 60 * 24))
        : null;

    // Calculate days until next drill
    const daysUntilNextDrill = Math.ceil(
        (new Date(emergencyPlan.nextDrillDue).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    const isDrillOverdue = daysUntilNextDrill < 0;

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
                        <h1 className="text-2xl font-bold text-gray-900">Emergency Plan</h1>
                        <p className="text-sm text-gray-500">Building emergency response procedures</p>
                    </div>
                </div>
                <Button>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Plan
                </Button>
            </div>

            {/* Plan Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Plan Version</CardDescription>
                        <CardTitle className="text-2xl">{emergencyPlan.version}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-gray-500">
                            Approved: {new Date(emergencyPlan.approvedDate).toLocaleDateString()}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Last Drill</CardDescription>
                        <CardTitle className="text-2xl">
                            {emergencyPlan.lastDrillDate
                                ? new Date(emergencyPlan.lastDrillDate).toLocaleDateString()
                                : 'Not conducted'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {daysSinceLastDrill !== null && (
                            <p className="text-xs text-gray-500">{daysSinceLastDrill} days ago</p>
                        )}
                    </CardContent>
                </Card>
                <Card className={isDrillOverdue ? 'border-red-200 bg-red-50' : ''}>
                    <CardHeader className="pb-2">
                        <CardDescription>Next Drill Due</CardDescription>
                        <CardTitle className={`text-2xl ${isDrillOverdue ? 'text-red-600' : ''}`}>
                            {new Date(emergencyPlan.nextDrillDue).toLocaleDateString()}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className={`text-xs ${isDrillOverdue ? 'text-red-600' : 'text-gray-500'}`}>
                            {isDrillOverdue ? `${Math.abs(daysUntilNextDrill)} days overdue` : `${daysUntilNextDrill} days`}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Evacuation Procedure */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        Evacuation Procedure
                    </CardTitle>
                    <CardDescription>Step-by-step emergency evacuation instructions</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="prose prose-sm max-w-none">
                        <div className="whitespace-pre-wrap text-gray-700">{emergencyPlan.evacuationProcedure}</div>
                    </div>
                </CardContent>
            </Card>

            {/* Assembly Points */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-blue-600" />
                        Assembly Points
                    </CardTitle>
                    <CardDescription>Designated meeting locations after evacuation</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {assemblyPoints.map((point: any, index: number) => (
                            <div key={index} className="p-4 border rounded-lg bg-blue-50">
                                <div className="flex items-start gap-3">
                                    <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900">{point.name}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{point.location}</p>
                                        {point.description && (
                                            <p className="text-xs text-gray-500 mt-1">{point.description}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Phone className="h-5 w-5 text-green-600" />
                        Emergency Contacts
                    </CardTitle>
                    <CardDescription>Key contacts for emergency situations</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {emergencyContacts.map((contact: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <h3 className="font-medium text-gray-900">{contact.name}</h3>
                                    <p className="text-sm text-gray-600">{contact.role}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900">{contact.phone}</p>
                                    {contact.email && (
                                        <p className="text-xs text-gray-500">{contact.email}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Drill Schedule */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-purple-600" />
                        Evacuation Drill Schedule
                    </CardTitle>
                    <CardDescription>Regular evacuation drill requirements</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <h3 className="font-medium text-gray-900">Last Drill Conducted</h3>
                                <p className="text-sm text-gray-600">
                                    {emergencyPlan.lastDrillDate
                                        ? new Date(emergencyPlan.lastDrillDate).toLocaleDateString()
                                        : 'No drill conducted yet'}
                                </p>
                            </div>
                            {daysSinceLastDrill !== null && (
                                <Badge variant="outline">{daysSinceLastDrill} days ago</Badge>
                            )}
                        </div>
                        <div className={`flex items-center justify-between p-4 border rounded-lg ${isDrillOverdue ? 'border-red-200 bg-red-50' : ''}`}>
                            <div>
                                <h3 className="font-medium text-gray-900">Next Drill Due</h3>
                                <p className="text-sm text-gray-600">
                                    {new Date(emergencyPlan.nextDrillDue).toLocaleDateString()}
                                </p>
                            </div>
                            {isDrillOverdue ? (
                                <Badge variant="destructive">Overdue</Badge>
                            ) : (
                                <Badge variant="outline">{daysUntilNextDrill} days</Badge>
                            )}
                        </div>
                        <Button className="w-full">
                            <Calendar className="h-4 w-4 mr-2" />
                            Schedule Evacuation Drill
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Compliance Notice */}
            <Card className="border-blue-200 bg-blue-50">
                <CardContent className="pt-6">
                    <div className="flex gap-3">
                        <AlertTriangle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-900">
                            <p className="font-medium mb-1">Emergency Planning Requirements</p>
                            <p>NSW strata buildings must maintain current emergency plans and conduct regular evacuation drills. Ensure all residents are familiar with evacuation procedures and assembly points. Update the plan whenever building modifications affect emergency egress.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Document */}
            {emergencyPlan.documentUrl && (
                <Card>
                    <CardHeader>
                        <CardTitle>Emergency Plan Document</CardTitle>
                        <CardDescription>Download the complete emergency plan</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline">
                            <FileText className="h-4 w-4 mr-2" />
                            Download Emergency Plan PDF
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
