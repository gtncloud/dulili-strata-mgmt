import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";
import { db as prisma } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, AlertTriangle, Calculator, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function NewPaymentPlanPage() {
    const session = await verifySession();
    if (!session) redirect("/auth/login");

    // Get user's overdue levies
    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        include: { 
            building: true,
            lot: true
        }
    });

    if (!user?.buildingId) {
        return <div>No building assigned</div>;
    }

    // Get overdue levies for this user
    const overdueLevies = await prisma.levy.findMany({
        where: {
            userId: session.userId,
            status: 'overdue'
        },
        orderBy: { dueDate: 'asc' }
    });

    // Calculate total owed
    const totalOwed = overdueLevies.reduce((sum: number, levy: any) => sum + levy.amount, 0);

    // Calculate interest (simple 10% annual rate after 30 days)
    const totalInterest = overdueLevies.reduce((sum: number, levy: any) => {
        const daysOverdue = Math.floor(
            (new Date().getTime() - new Date(levy.dueDate).getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysOverdue > 30) {
            return sum + (levy.amount * 0.10 * (daysOverdue / 365));
        }
        return sum;
    }, 0);

    const totalWithInterest = totalOwed + totalInterest;

    // Check if user already has an active payment plan
    const existingPlan = await prisma.levyPaymentPlan.findFirst({
        where: {
            userId: session.userId,
            status: { in: ['pending', 'approved', 'active'] }
        }
    });

    if (existingPlan) {
        return (
            <div className="p-6 max-w-4xl mx-auto">
                <Card className="border-amber-200 bg-amber-50">
                    <CardContent className="pt-6">
                        <div className="flex gap-3">
                            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium text-amber-900 mb-1">Existing Payment Plan</p>
                                <p className="text-sm text-amber-800">
                                    You already have a payment plan in progress. Please complete or cancel your existing plan before requesting a new one.
                                </p>
                                <Link href={`/dashboard/finance/debt-recovery/payment-plans/${existingPlan.id}`}>
                                    <Button className="mt-3" size="sm">
                                        View Existing Plan
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (overdueLevies.length === 0) {
        return (
            <div className="p-6 max-w-4xl mx-auto">
                <Card>
                    <CardContent className="pt-6 text-center py-12">
                        <p className="text-gray-600">You have no overdue levies</p>
                        <Link href="/dashboard/finance">
                            <Button className="mt-4">
                                View Levy History
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/finance/debt-recovery">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Debt Recovery
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Request Payment Plan</h1>
                    <p className="text-sm text-gray-500">NSW Standard Payment Plan Request Form</p>
                </div>
            </div>

            {/* NSW Information */}
            <Card className="border-blue-200 bg-blue-50">
                <CardContent className="pt-6">
                    <div className="flex gap-3">
                        <FileText className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-900">
                            <p className="font-medium mb-1">NSW Payment Plan Rights</p>
                            <p>Under NSW strata law, you have the right to request a payment plan for overdue levies. The Owners Corporation must respond within 28 days. No additional financial information beyond this standard form can be requested.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Amount Summary */}
            <Card>
                <CardHeader>
                    <CardTitle>Amount Owed</CardTitle>
                    <CardDescription>Summary of your overdue levies</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Overdue Levies</span>
                            <span className="font-medium text-gray-900">
                                ${totalOwed.toLocaleString('en-AU', { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Accrued Interest</span>
                            <span className="font-medium text-amber-600">
                                ${totalInterest.toLocaleString('en-AU', { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                        <div className="border-t pt-3 flex justify-between">
                            <span className="font-medium text-gray-900">Total Amount</span>
                            <span className="font-bold text-lg text-gray-900">
                                ${totalWithInterest.toLocaleString('en-AU', { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>

                    {/* Overdue Levies List */}
                    <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-medium text-gray-900 mb-2">Overdue Levies:</p>
                        <div className="space-y-2">
                            {overdueLevies.map((levy: any) => (
                                <div key={levy.id} className="text-sm flex justify-between">
                                    <span className="text-gray-600">
                                        {levy.type} - {levy.period}
                                    </span>
                                    <span className="text-gray-900">
                                        ${levy.amount.toLocaleString('en-AU', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Payment Calculator */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calculator className="h-5 w-5" />
                        Payment Plan Calculator
                    </CardTitle>
                    <CardDescription>Calculate affordable installment amounts</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 border rounded-lg text-center">
                                <p className="text-sm text-gray-600 mb-1">3 Months</p>
                                <p className="text-lg font-bold text-gray-900">
                                    ${(totalWithInterest / 3).toLocaleString('en-AU', { minimumFractionDigits: 2 })}
                                </p>
                                <p className="text-xs text-gray-500">per month</p>
                            </div>
                            <div className="p-4 border rounded-lg text-center bg-blue-50 border-blue-200">
                                <p className="text-sm text-gray-600 mb-1">6 Months</p>
                                <p className="text-lg font-bold text-blue-600">
                                    ${(totalWithInterest / 6).toLocaleString('en-AU', { minimumFractionDigits: 2 })}
                                </p>
                                <p className="text-xs text-gray-500">per month</p>
                            </div>
                            <div className="p-4 border rounded-lg text-center">
                                <p className="text-sm text-gray-600 mb-1">12 Months</p>
                                <p className="text-lg font-bold text-gray-900">
                                    ${(totalWithInterest / 12).toLocaleString('en-AU', { minimumFractionDigits: 2 })}
                                </p>
                                <p className="text-xs text-gray-500">per month</p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500">
                            Maximum payment plan duration is 12 months under NSW law
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Request Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Payment Plan Request</CardTitle>
                    <CardDescription>Complete the standard NSW payment plan request form</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Number of Installments
                            </label>
                            <select className="w-full p-2 border rounded">
                                <option value="3">3 monthly installments</option>
                                <option value="6">6 monthly installments</option>
                                <option value="9">9 monthly installments</option>
                                <option value="12">12 monthly installments (maximum)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Installment Frequency
                            </label>
                            <select className="w-full p-2 border rounded">
                                <option value="monthly">Monthly</option>
                                <option value="fortnightly">Fortnightly</option>
                                <option value="weekly">Weekly</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Proposed Start Date
                            </label>
                            <input 
                                type="date" 
                                className="w-full p-2 border rounded"
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="interestWaiver" className="rounded" />
                            <label htmlFor="interestWaiver" className="text-sm text-gray-700">
                                Request interest waiver (requires separate vote)
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Additional Comments (Optional)
                            </label>
                            <textarea 
                                className="w-full p-2 border rounded"
                                rows={4}
                                placeholder="Any additional information you'd like to provide..."
                            />
                        </div>

                        <div className="pt-4 border-t">
                            <Button className="w-full" size="lg">
                                <FileText className="h-4 w-4 mr-2" />
                                Submit Payment Plan Request
                            </Button>
                            <p className="text-xs text-gray-500 text-center mt-2">
                                The Owners Corporation must respond within 28 days
                            </p>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Important Information */}
            <Card className="border-amber-200 bg-amber-50">
                <CardHeader>
                    <CardTitle className="text-sm">Important Information</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-amber-900 space-y-2">
                    <p>• The Owners Corporation must respond to your request within 28 days</p>
                    <p>• If approved, you must follow the payment schedule to avoid default</p>
                    <p>• Recovery action cannot proceed while you're following an approved plan</p>
                    <p>• You can request an extension if circumstances change</p>
                    <p>• Interest waiver requires a separate vote and may be declined</p>
                    <p>• If your request is refused, you can request free mediation through NSW Fair Trading</p>
                </CardContent>
            </Card>
        </div>
    );
}
