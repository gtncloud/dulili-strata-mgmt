import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";
import { db as prisma } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertTriangle, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function PaymentPlansPage() {
    const session = await verifySession();
    if (!session) redirect("/auth/login");

    // Get user's building
    const membership = await prisma.buildingMembership.findFirst({
        where: {
            userId: session.userId,
            status: "active",
        },
        include: { building: true }
    });

    if (!membership?.buildingId) {
        return <div>No building assigned</div>;
    }

    // Get all payment plans
    const paymentPlans = await prisma.levyPaymentPlan.findMany({
        where: { buildingId: membership.buildingId },
        include: {
            lot: true,
            user: true,
            payments: true
        },
        orderBy: { requestDate: 'desc' }
    });

    // Group by status
    const pending = paymentPlans.filter((p: any) => p.status === 'pending');
    const active = paymentPlans.filter((p: any) => p.status === 'active');
    const completed = paymentPlans.filter((p: any) => p.status === 'completed');
    const rejected = paymentPlans.filter((p: any) => p.status === 'rejected');
    const defaulted = paymentPlans.filter((p: any) => p.status === 'defaulted');

    // Calculate statistics
    const totalPlans = paymentPlans.length;
    const activePlansValue = active.reduce((sum: number, plan: any) => sum + plan.totalOwed, 0);
    const pendingRequests = pending.length;

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
                    <h1 className="text-2xl font-bold text-gray-900">Payment Plans</h1>
                    <p className="text-sm text-gray-500">Manage levy payment plans</p>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Total Plans</CardDescription>
                        <CardTitle className="text-3xl">{totalPlans}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Active Plans</CardDescription>
                        <CardTitle className="text-3xl text-blue-600">{active.length}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-gray-500">
                            ${activePlansValue.toLocaleString('en-AU', { minimumFractionDigits: 2 })}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Pending Requests</CardDescription>
                        <CardTitle className="text-3xl text-amber-600">{pendingRequests}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-gray-500">Awaiting response</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Completed</CardDescription>
                        <CardTitle className="text-3xl text-green-600">{completed.length}</CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Pending Requests */}
            {pending.length > 0 && (
                <Card className="border-amber-200">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-amber-600" />
                                    Pending Requests
                                </CardTitle>
                                <CardDescription>Requires response within 28 days</CardDescription>
                            </div>
                            <Badge className="bg-amber-100 text-amber-800">{pending.length} pending</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {pending.map((plan: any) => {
                                const daysElapsed = Math.floor(
                                    (new Date().getTime() - new Date(plan.requestDate).getTime()) / (1000 * 60 * 60 * 24)
                                );
                                const daysRemaining = 28 - daysElapsed;
                                const isUrgent = daysRemaining <= 7;

                                return (
                                    <div key={plan.id} className={`p-4 border rounded-lg ${isUrgent ? 'border-red-200 bg-red-50' : 'bg-amber-50'}`}>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="font-medium text-gray-900">
                                                        {plan.lot.lotNumber} - {plan.user.name}
                                                    </h3>
                                                    {isUrgent && (
                                                        <Badge variant="destructive">Urgent</Badge>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <p className="text-gray-600">Total Owed</p>
                                                        <p className="font-medium text-gray-900">
                                                            ${plan.totalOwed.toLocaleString('en-AU', { minimumFractionDigits: 2 })}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-600">Requested</p>
                                                        <p className="font-medium text-gray-900">
                                                            {new Date(plan.requestDate).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-600">Installments</p>
                                                        <p className="font-medium text-gray-900">
                                                            {plan.numberOfInstallments} × ${plan.installmentAmount.toLocaleString('en-AU', { minimumFractionDigits: 2 })}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-600">Response Due</p>
                                                        <p className={`font-medium ${isUrgent ? 'text-red-600' : 'text-gray-900'}`}>
                                                            {daysRemaining} days remaining
                                                        </p>
                                                    </div>
                                                </div>
                                                {plan.requestInterestWaiver && (
                                                    <div className="mt-2 text-xs text-blue-600">
                                                        ℹ️ Interest waiver requested
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-4 space-y-2">
                                                <Link href={`/dashboard/finance/debt-recovery/payment-plans/${plan.id}`}>
                                                    <Button size="sm" className="w-full">
                                                        Review Request
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Active Plans */}
            {active.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-blue-600" />
                            Active Payment Plans
                        </CardTitle>
                        <CardDescription>Currently in progress</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {active.map((plan: any) => {
                                const paidAmount = plan.payments
                                    .filter((p: any) => p.status === 'paid')
                                    .reduce((sum: number, p: any) => sum + (p.paidAmount || 0), 0);
                                const progress = (paidAmount / plan.totalOwed) * 100;

                                return (
                                    <div key={plan.id} className="p-4 border rounded-lg bg-blue-50">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="font-medium text-gray-900">
                                                        {plan.lot.lotNumber} - {plan.user.name}
                                                    </h3>
                                                    <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                                                    <div>
                                                        <p className="text-gray-600">Total Owed</p>
                                                        <p className="font-medium text-gray-900">
                                                            ${plan.totalOwed.toLocaleString('en-AU', { minimumFractionDigits: 2 })}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-600">Paid</p>
                                                        <p className="font-medium text-green-600">
                                                            ${paidAmount.toLocaleString('en-AU', { minimumFractionDigits: 2 })}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-600">Installments</p>
                                                        <p className="font-medium text-gray-900">
                                                            {plan.paidInstallments} of {plan.numberOfInstallments} paid
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-600">End Date</p>
                                                        <p className="font-medium text-gray-900">
                                                            {plan.endDate ? new Date(plan.endDate).toLocaleDateString() : 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>
                                                {/* Progress Bar */}
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div 
                                                        className="bg-blue-600 h-2 rounded-full transition-all"
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                                <p className="text-xs text-gray-600 mt-1">{progress.toFixed(1)}% complete</p>
                                            </div>
                                            <div className="ml-4">
                                                <Link href={`/dashboard/finance/debt-recovery/payment-plans/${plan.id}`}>
                                                    <Button size="sm" variant="outline">
                                                        View Details
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Completed Plans */}
            {completed.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            Completed Payment Plans
                        </CardTitle>
                        <CardDescription>Successfully completed</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {completed.map((plan: any) => (
                                <div key={plan.id} className="p-4 border rounded-lg bg-green-50">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="font-medium text-gray-900">
                                                    {plan.lot.lotNumber} - {plan.user.name}
                                                </h3>
                                                <Badge className="bg-green-100 text-green-800">Completed</Badge>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <p className="text-gray-600">Total Paid</p>
                                                    <p className="font-medium text-gray-900">
                                                        ${plan.totalOwed.toLocaleString('en-AU', { minimumFractionDigits: 2 })}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">Completed</p>
                                                    <p className="font-medium text-gray-900">
                                                        {plan.endDate ? new Date(plan.endDate).toLocaleDateString() : 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <Link href={`/dashboard/finance/debt-recovery/payment-plans/${plan.id}`}>
                                                <Button size="sm" variant="outline">
                                                    View History
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Rejected/Defaulted */}
            {(rejected.length > 0 || defaulted.length > 0) && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <XCircle className="h-5 w-5 text-red-600" />
                            Rejected & Defaulted Plans
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {[...rejected, ...defaulted].map((plan: any) => (
                                <div key={plan.id} className="p-4 border rounded-lg bg-red-50 border-red-200">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="font-medium text-gray-900">
                                                    {plan.lot.lotNumber} - {plan.user.name}
                                                </h3>
                                                <Badge variant="destructive">
                                                    {plan.status === 'rejected' ? 'Rejected' : 'Defaulted'}
                                                </Badge>
                                            </div>
                                            <div className="text-sm">
                                                <p className="text-gray-600">Amount: ${plan.totalOwed.toLocaleString('en-AU', { minimumFractionDigits: 2 })}</p>
                                                {plan.refusalReason && (
                                                    <p className="text-red-600 mt-1">Reason: {plan.refusalReason}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <Link href={`/dashboard/finance/debt-recovery/payment-plans/${plan.id}`}>
                                                <Button size="sm" variant="outline">
                                                    View Details
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Empty State */}
            {paymentPlans.length === 0 && (
                <Card>
                    <CardContent className="text-center py-12">
                        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No payment plans yet</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
