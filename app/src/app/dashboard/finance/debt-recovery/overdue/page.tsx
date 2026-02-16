import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";
import { db as prisma } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, AlertTriangle, DollarSign, Calendar, Send, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function OverdueLeviesPage() {
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

    // Get all overdue levies
    const overdueLevies = await prisma.levy.findMany({
        where: {
            buildingId: user.buildingId,
            status: 'overdue'
        },
        include: {
            lot: true,
            user: true
        },
        orderBy: { dueDate: 'asc' }
    });

    // Get payment plans for overdue levies
    const paymentPlans = await prisma.levyPaymentPlan.findMany({
        where: {
            buildingId: user.buildingId,
            status: { in: ['pending', 'approved', 'active'] }
        },
        include: {
            lot: true,
            user: true
        }
    });

    // Calculate statistics
    const totalOverdue = overdueLevies.reduce((sum, levy) => sum + levy.amount, 0);
    const totalInterest = overdueLevies.reduce((sum, levy) => {
        const daysOverdue = Math.floor((new Date().getTime() - new Date(levy.dueDate).getTime()) / (1000 * 60 * 60 * 24));
        if (daysOverdue > 30) {
            // Simple interest calculation (10% annual rate)
            const interest = levy.amount * 0.10 * (daysOverdue / 365);
            return sum + interest;
        }
        return sum;
    }, 0);

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
                    <h1 className="text-2xl font-bold text-gray-900">Overdue Levies</h1>
                    <p className="text-sm text-gray-500">Manage overdue levy payments and recovery actions</p>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Total Overdue</CardDescription>
                        <CardTitle className="text-3xl text-red-600">
                            ${totalOverdue.toLocaleString('en-AU', { minimumFractionDigits: 2 })}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-gray-500">{overdueLevies.length} overdue levies</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Accrued Interest</CardDescription>
                        <CardTitle className="text-3xl text-amber-600">
                            ${totalInterest.toLocaleString('en-AU', { minimumFractionDigits: 2 })}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-gray-500">10% annual rate</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Active Payment Plans</CardDescription>
                        <CardTitle className="text-3xl text-blue-600">{paymentPlans.length}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-gray-500">NSW compliant plans</p>
                    </CardContent>
                </Card>
            </div>

            {/* NSW Compliance Notice */}
            <Card className="border-amber-200 bg-amber-50">
                <CardContent className="pt-6">
                    <div className="flex gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-amber-900">
                            <p className="font-medium mb-1">NSW 2025 Debt Recovery Requirements</p>
                            <p>You MUST offer a payment plan before taking any debt recovery action. Recovery action cannot proceed while an owner is following an approved payment plan.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Overdue Levies List */}
            <Card>
                <CardHeader>
                    <CardTitle>Overdue Levies</CardTitle>
                    <CardDescription>All levies past their due date</CardDescription>
                </CardHeader>
                <CardContent>
                    {overdueLevies.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <p>No overdue levies</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {overdueLevies.map((levy) => {
                                const daysOverdue = Math.floor(
                                    (new Date().getTime() - new Date(levy.dueDate).getTime()) / (1000 * 60 * 60 * 24)
                                );
                                
                                // Calculate interest (starts after 30 days)
                                let interest = 0;
                                if (daysOverdue > 30) {
                                    interest = levy.amount * 0.10 * (daysOverdue / 365);
                                }

                                // Check if there's an active payment plan
                                const activePlan = paymentPlans.find(
                                    plan => plan.userId === levy.userId && 
                                    ['approved', 'active'].includes(plan.status)
                                );

                                // Check if payment plan has been offered
                                const planOffered = paymentPlans.find(
                                    plan => plan.userId === levy.userId
                                );

                                return (
                                    <div key={levy.id} className="p-4 border rounded-lg bg-red-50 border-red-200">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="font-medium text-gray-900">
                                                        {levy.lot.lotNumber} - {levy.user.name}
                                                    </h3>
                                                    <Badge variant="destructive">{daysOverdue} days overdue</Badge>
                                                    {activePlan && (
                                                        <Badge className="bg-blue-100 text-blue-800">Payment Plan Active</Badge>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <p className="text-gray-600">Levy Amount</p>
                                                        <p className="font-medium text-gray-900">
                                                            ${levy.amount.toLocaleString('en-AU', { minimumFractionDigits: 2 })}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-600">Interest Accrued</p>
                                                        <p className="font-medium text-amber-600">
                                                            ${interest.toLocaleString('en-AU', { minimumFractionDigits: 2 })}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-600">Due Date</p>
                                                        <p className="font-medium text-gray-900">
                                                            {new Date(levy.dueDate).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-600">Total Owed</p>
                                                        <p className="font-medium text-red-600">
                                                            ${(levy.amount + interest).toLocaleString('en-AU', { minimumFractionDigits: 2 })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="mt-3 text-xs text-gray-600">
                                                    <p><span className="font-medium">Type:</span> {levy.type}</p>
                                                    <p><span className="font-medium">Period:</span> {levy.period}</p>
                                                    {levy.description && (
                                                        <p><span className="font-medium">Description:</span> {levy.description}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="ml-4 space-y-2">
                                                {!activePlan && (
                                                    <>
                                                        {!planOffered && (
                                                            <Button size="sm" className="w-full">
                                                                <FileText className="h-3 w-3 mr-1" />
                                                                Offer Payment Plan
                                                            </Button>
                                                        )}
                                                        <Button size="sm" variant="outline" className="w-full">
                                                            <Send className="h-3 w-3 mr-1" />
                                                            Send Reminder
                                                        </Button>
                                                    </>
                                                )}
                                                {activePlan && (
                                                    <Link href={`/dashboard/finance/debt-recovery/payment-plans/${activePlan.id}`}>
                                                        <Button size="sm" variant="outline" className="w-full">
                                                            View Payment Plan
                                                        </Button>
                                                    </Link>
                                                )}
                                            </div>
                                        </div>

                                        {/* Compliance Check */}
                                        {!planOffered && daysOverdue > 30 && (
                                            <div className="mt-3 p-3 bg-amber-100 border border-amber-200 rounded text-xs text-amber-900">
                                                <p className="font-medium">⚠️ NSW Compliance Required</p>
                                                <p>Payment plan must be offered before recovery action can proceed.</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Payment Application Order */}
            <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                    <CardTitle className="text-sm">Payment Application Order</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-blue-900 space-y-1">
                        <p>When payments are received, they must be applied in this order:</p>
                        <ol className="list-decimal list-inside ml-2 space-y-1">
                            <li>Oldest overdue levies first</li>
                            <li>Interest charges</li>
                            <li>Recovery costs</li>
                        </ol>
                        <p className="text-xs mt-2 text-blue-700">Unless a court/tribunal order or owner specifies otherwise</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
