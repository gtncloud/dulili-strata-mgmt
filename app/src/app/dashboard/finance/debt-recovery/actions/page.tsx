import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";
import { db as prisma } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, FileText, Send, AlertTriangle, Scale, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function DebtRecoveryActionsPage() {
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

    // Get all recovery actions
    const recoveryActions = await prisma.debtRecoveryAction.findMany({
        where: { buildingId: user.buildingId },
        include: {
            lot: true,
            user: true
        },
        orderBy: { actionDate: 'desc' }
    });

    // Group by action type
    const notices = recoveryActions.filter((a: any) => a.actionType === 'notice');
    const reminders = recoveryActions.filter((a: any) => a.actionType === 'reminder');
    const tribunalApplications = recoveryActions.filter((a: any) => a.actionType === 'tribunal_application');
    const courtActions = recoveryActions.filter((a: any) => a.actionType === 'court_action');

    // Calculate statistics
    const totalActions = recoveryActions.length;
    const pendingActions = recoveryActions.filter((a: any) => a.status === 'pending').length;
    const completedActions = recoveryActions.filter((a: any) => a.status === 'completed').length;

    // Action type configuration
    const actionTypeConfig = {
        notice: { icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Notice' },
        reminder: { icon: Send, color: 'text-amber-600', bg: 'bg-amber-50', label: 'Reminder' },
        tribunal_application: { icon: Scale, color: 'text-purple-600', bg: 'bg-purple-50', label: 'Tribunal Application' },
        court_action: { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', label: 'Court Action' }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/finance/debt-recovery">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Debt Recovery
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Recovery Actions</h1>
                    <p className="text-sm text-gray-500">Debt recovery action history and tracking</p>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Total Actions</CardDescription>
                        <CardTitle className="text-3xl">{totalActions}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Pending</CardDescription>
                        <CardTitle className="text-3xl text-amber-600">{pendingActions}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Completed</CardDescription>
                        <CardTitle className="text-3xl text-green-600">{completedActions}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Tribunal/Court</CardDescription>
                        <CardTitle className="text-3xl text-purple-600">
                            {tribunalApplications.length + courtActions.length}
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* NSW Compliance Notice */}
            <Card className="border-blue-200 bg-blue-50">
                <CardContent className="pt-6">
                    <div className="flex gap-3">
                        <AlertTriangle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-900">
                            <p className="font-medium mb-1">NSW Debt Recovery Compliance</p>
                            <p>All recovery actions must comply with NSW Strata Schemes Management Act Section 86. Payment plan must be offered before tribunal or court action. Keep detailed records of all communications and actions.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Action Timeline */}
            <Card>
                <CardHeader>
                    <CardTitle>Recovery Action Timeline</CardTitle>
                    <CardDescription>Chronological history of all debt recovery actions</CardDescription>
                </CardHeader>
                <CardContent>
                    {recoveryActions.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <p>No recovery actions recorded</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recoveryActions.map((action: any) => {
                                const config = actionTypeConfig[action.actionType as keyof typeof actionTypeConfig];
                                const ActionIcon = config.icon;

                                return (
                                    <div key={action.id} className={`p-4 border rounded-lg ${config.bg}`}>
                                        <div className="flex items-start gap-4">
                                            <div className={`p-2 rounded-lg bg-white`}>
                                                <ActionIcon className={`h-5 w-5 ${config.color}`} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="font-medium text-gray-900">{config.label}</h3>
                                                    <Badge className={
                                                        action.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                        action.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                                                        'bg-amber-100 text-amber-800'
                                                    }>
                                                        {action.status}
                                                    </Badge>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                                                    <div>
                                                        <p className="text-gray-600">Lot & Owner</p>
                                                        <p className="font-medium text-gray-900">
                                                            {action.lot.lotNumber} - {action.user.name}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-600">Amount Owed</p>
                                                        <p className="font-medium text-gray-900">
                                                            ${action.amountOwed.toLocaleString('en-AU', { minimumFractionDigits: 2 })}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-600">Action Date</p>
                                                        <p className="font-medium text-gray-900">
                                                            {new Date(action.actionDate).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    {action.dueDate && (
                                                        <div>
                                                            <p className="text-gray-600">Due Date</p>
                                                            <p className="font-medium text-gray-900">
                                                                {new Date(action.dueDate).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-700">{action.description}</p>
                                                {action.tribunalOrderNumber && (
                                                    <p className="text-xs text-gray-600 mt-2">
                                                        Order Number: {action.tribunalOrderNumber}
                                                    </p>
                                                )}
                                                {action.notes && (
                                                    <p className="text-xs text-gray-600 mt-2">
                                                        Notes: {action.notes}
                                                    </p>
                                                )}
                                                {action.documentUrl && (
                                                    <Button size="sm" variant="outline" className="mt-2">
                                                        <FileText className="h-3 w-3 mr-1" />
                                                        View Document
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

            {/* Action Summary by Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Notices & Reminders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Notices Sent</span>
                                <span className="font-medium text-gray-900">{notices.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Reminders Sent</span>
                                <span className="font-medium text-gray-900">{reminders.length}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Legal Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tribunal Applications</span>
                                <span className="font-medium text-gray-900">{tribunalApplications.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Court Actions</span>
                                <span className="font-medium text-gray-900">{courtActions.length}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recovery Process Guide */}
            <Card className="border-green-200 bg-green-50">
                <CardHeader>
                    <CardTitle className="text-sm">NSW Debt Recovery Process</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-green-900 space-y-2">
                    <p className="font-medium">Standard recovery process:</p>
                    <ol className="list-decimal list-inside ml-2 space-y-1">
                        <li>Send reminder notices (7, 14, 30 days overdue)</li>
                        <li>Offer payment plan (mandatory before recovery action)</li>
                        <li>If payment plan refused or defaulted, apply to NCAT</li>
                        <li>Obtain tribunal order for debt recovery</li>
                        <li>If necessary, proceed to court for enforcement</li>
                    </ol>
                    <p className="text-xs mt-2 text-green-700">
                        Always consult a solicitor before proceeding with tribunal or court action
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
