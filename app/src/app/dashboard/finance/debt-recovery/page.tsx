import { verifySession } from "@/lib/session";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
    CreditCard, 
    AlertTriangle, 
    CheckCircle2, 
    Clock,
    DollarSign,
    FileText,
    AlertCircle,
    TrendingUp
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function DebtRecoveryPage() {
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

    // Fetch debt recovery data
    const [overdueLevies, paymentPlans, recoveryActions] = await Promise.all([
        db.levy.findMany({
            where: {
                buildingId: membership.buildingId,
                status: "overdue",
            },
            include: {
                lot: true,
            },
            orderBy: { dueDate: "asc" },
        }),
        db.levyPaymentPlan.findMany({
            where: {
                buildingId: membership.buildingId,
                status: { in: ["pending", "active"] },
            },
            include: {
                lot: true,
                user: {
                    select: { name: true, email: true },
                },
            },
            orderBy: { requestDate: "desc" },
        }),
        db.debtRecoveryAction.findMany({
            where: {
                buildingId: membership.buildingId,
            },
            orderBy: { actionDate: "desc" },
            take: 10,
        }),
    ]);

    // Calculate statistics
    const totalOverdue = overdueLevies.reduce((sum, levy) => sum + levy.amount, 0);
    const activePaymentPlans = paymentPlans.filter(p => p.status === "active").length;
    const pendingRequests = paymentPlans.filter(p => p.status === "pending").length;
    
    // Calculate days overdue
    const now = new Date();
    const leviesWithDays = overdueLevies.map(levy => {
        const daysOverdue = Math.floor((now.getTime() - new Date(levy.dueDate).getTime()) / (1000 * 60 * 60 * 24));
        return { ...levy, daysOverdue };
    });

    // Check compliance - payment plan must be offered before recovery
    const leviesNeedingPaymentPlan = leviesWithDays.filter(levy => {
        const hasPaymentPlanOffer = recoveryActions.some(
            action => action.lotId === levy.lotId && action.actionType === "payment_plan_offered"
        );
        return !hasPaymentPlanOffer && levy.daysOverdue > 30;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Debt Recovery</h1>
                <p className="text-gray-600 mt-2">
                    Manage overdue levies and payment plans (NSW compliant)
                </p>
            </div>

            {/* Compliance Notice */}
            <Card className="border-blue-200 bg-blue-50">
                <CardContent className="pt-6">
                    <div className="flex gap-3">
                        <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-900">
                            <p className="font-medium mb-1">NSW 2025 Debt Recovery Reforms</p>
                            <p>
                                Under NSW Strata Schemes Management Act Section 86, Owners Corporations MUST offer 
                                a payment plan before taking recovery action. Recovery action cannot proceed while 
                                a payment plan is being followed. This tool ensures compliance with all NSW requirements.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Compliance Alert */}
            {leviesNeedingPaymentPlan.length > 0 && (
                <Card className="border-amber-200 bg-amber-50">
                    <CardHeader>
                        <CardTitle className="text-amber-900 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" />
                            Compliance Action Required
                        </CardTitle>
                        <CardDescription className="text-amber-700">
                            Payment plan must be offered before recovery action
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-amber-800 mb-3">
                            {leviesNeedingPaymentPlan.length} overdue {leviesNeedingPaymentPlan.length === 1 ? "levy" : "levies"} 
                            {" "}over 30 days without payment plan offer. NSW law requires offering a payment plan before 
                            taking recovery action.
                        </p>
                        <Link href="/dashboard/finance/debt-recovery/overdue">
                            <Button variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100">
                                Review Overdue Levies
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            )}

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Total Overdue
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="text-3xl font-bold text-red-600">
                                ${totalOverdue.toLocaleString()}
                            </div>
                            <DollarSign className="h-8 w-8 text-red-600" />
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                            {overdueLevies.length} overdue {overdueLevies.length === 1 ? "levy" : "levies"}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Active Payment Plans
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="text-3xl font-bold text-blue-600">
                                {activePaymentPlans}
                            </div>
                            <CheckCircle2 className="h-8 w-8 text-blue-600" />
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                            Being repaid in installments
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Pending Requests
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="text-3xl font-bold text-amber-600">
                                {pendingRequests}
                            </div>
                            <Clock className="h-8 w-8 text-amber-600" />
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                            Awaiting committee decision
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Recovery Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="text-3xl font-bold text-gray-900">
                                {recoveryActions.length}
                            </div>
                            <FileText className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                            Total actions taken
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                        Common debt recovery tasks
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link href="/dashboard/finance/debt-recovery/overdue">
                            <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
                                <AlertTriangle className="h-6 w-6" />
                                <span>View Overdue Levies</span>
                            </Button>
                        </Link>
                        <Link href="/dashboard/finance/debt-recovery/payment-plans">
                            <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
                                <CreditCard className="h-6 w-6" />
                                <span>Payment Plans</span>
                            </Button>
                        </Link>
                        <Link href="/dashboard/finance/debt-recovery/actions">
                            <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
                                <FileText className="h-6 w-6" />
                                <span>Recovery Actions</span>
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* Pending Payment Plan Requests */}
            {pendingRequests > 0 && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Pending Payment Plan Requests</CardTitle>
                                <CardDescription>
                                    Require committee decision within 28 days
                                </CardDescription>
                            </div>
                            <Link href="/dashboard/finance/debt-recovery/payment-plans">
                                <Button variant="outline" size="sm">View All</Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {paymentPlans.filter(p => p.status === "pending").map((plan) => {
                                const daysWaiting = Math.floor(
                                    (now.getTime() - new Date(plan.requestDate).getTime()) / (1000 * 60 * 60 * 24)
                                );
                                const daysRemaining = 28 - daysWaiting;
                                
                                return (
                                    <div key={plan.id} className="p-4 border rounded-lg">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    Lot {plan.lot.lotNumber} - {plan.user.name}
                                                </p>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Requested: {new Date(plan.requestDate).toLocaleDateString()}
                                                </p>
                                                <div className="flex items-center gap-4 mt-2 text-sm">
                                                    <span className="text-gray-600">
                                                        Amount: ${plan.totalOwed.toLocaleString()}
                                                    </span>
                                                    <span className="text-gray-600">
                                                        {plan.numberOfInstallments} installments
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <Badge variant={daysRemaining <= 7 ? "destructive" : "secondary"}>
                                                    {daysRemaining} days to respond
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Recent Overdue Levies */}
            {overdueLevies.length > 0 && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Recent Overdue Levies</CardTitle>
                                <CardDescription>
                                    Levies requiring attention
                                </CardDescription>
                            </div>
                            <Link href="/dashboard/finance/debt-recovery/overdue">
                                <Button variant="outline" size="sm">View All</Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {leviesWithDays.slice(0, 5).map((levy) => (
                                <div key={levy.id} className="p-4 border rounded-lg">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                Lot {levy.lot.lotNumber} - {levy.period}
                                            </p>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Due: {new Date(levy.dueDate).toLocaleDateString()}
                                            </p>
                                            <div className="flex items-center gap-4 mt-2 text-sm">
                                                <span className="text-gray-600">
                                                    Amount: ${levy.amount.toLocaleString()}
                                                </span>
                                                <span className="text-red-600 font-medium">
                                                    {levy.daysOverdue} days overdue
                                                </span>
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

            {/* NSW Compliance Information */}
            <Card>
                <CardHeader>
                    <CardTitle>NSW Debt Recovery Requirements</CardTitle>
                    <CardDescription>
                        Key compliance points under 2025 reforms
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium text-gray-900">Payment Plan Must Be Offered</p>
                                <p className="text-gray-600 mt-1">
                                    Before taking recovery action, you must offer the owner a payment plan option
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium text-gray-900">28-Day Response Time</p>
                                <p className="text-gray-600 mt-1">
                                    Payment plan requests must receive a response within 28 days
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium text-gray-900">No Recovery During Active Plan</p>
                                <p className="text-gray-600 mt-1">
                                    Recovery action cannot proceed while a payment plan is being followed
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium text-gray-900">Payment Application Order</p>
                                <p className="text-gray-600 mt-1">
                                    Payments must be applied first to levies (oldest first), then interest, then costs
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
