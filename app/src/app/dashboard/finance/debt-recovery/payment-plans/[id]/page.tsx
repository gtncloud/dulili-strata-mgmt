import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";
import { db as prisma } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Clock, XCircle, DollarSign, Calendar, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function PaymentPlanDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await verifySession();
    if (!session) redirect("/auth/login");

    // Get payment plan with all details
    const paymentPlan = await prisma.levyPaymentPlan.findUnique({
        where: { id },
        include: {
            lot: true,
            user: true,
            payments: {
                orderBy: { installmentNumber: 'asc' }
            },
            extensions: {
                orderBy: { requestDate: 'desc' }
            }
        }
    });

    if (!paymentPlan) {
        return <div>Payment plan not found</div>;
    }

    // Calculate totals
    const totalPaid = paymentPlan.payments
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + (p.paidAmount || 0), 0);
    const totalRemaining = paymentPlan.totalOwed - totalPaid;
    const progress = (totalPaid / paymentPlan.totalOwed) * 100;

    // Status configuration
    const statusConfig = {
        pending: { color: 'bg-amber-100 text-amber-800', label: 'Pending Review' },
        approved: { color: 'bg-green-100 text-green-800', label: 'Approved' },
        rejected: { color: 'bg-red-100 text-red-800', label: 'Rejected' },
        active: { color: 'bg-blue-100 text-blue-800', label: 'Active' },
        completed: { color: 'bg-green-100 text-green-800', label: 'Completed' },
        defaulted: { color: 'bg-red-100 text-red-800', label: 'Defaulted' }
    };

    const status = statusConfig[paymentPlan.status as keyof typeof statusConfig];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/finance/debt-recovery/payment-plans">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Payment Plans
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Payment Plan Details</h1>
                        <p className="text-sm text-gray-500">
                            {paymentPlan.lot.lotNumber} - {paymentPlan.user.name}
                        </p>
                    </div>
                </div>
                <Badge className={status.color}>{status.label}</Badge>
            </div>

            {/* Plan Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Total Owed</CardDescription>
                        <CardTitle className="text-2xl">
                            ${paymentPlan.totalOwed.toLocaleString('en-AU', { minimumFractionDigits: 2 })}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-gray-500">
                            Levies: ${paymentPlan.totalOwed.toLocaleString('en-AU', { minimumFractionDigits: 2 })}
                        </p>
                        {paymentPlan.interestOwed > 0 && (
                            <p className="text-xs text-gray-500">
                                Interest: ${paymentPlan.interestOwed.toLocaleString('en-AU', { minimumFractionDigits: 2 })}
                            </p>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Total Paid</CardDescription>
                        <CardTitle className="text-2xl text-green-600">
                            ${totalPaid.toLocaleString('en-AU', { minimumFractionDigits: 2 })}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-gray-500">
                            {paymentPlan.paidInstallments} of {paymentPlan.numberOfInstallments} installments
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Remaining</CardDescription>
                        <CardTitle className="text-2xl text-blue-600">
                            ${totalRemaining.toLocaleString('en-AU', { minimumFractionDigits: 2 })}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-gray-500">
                            {paymentPlan.numberOfInstallments - paymentPlan.paidInstallments} installments left
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Progress</CardDescription>
                        <CardTitle className="text-2xl">{progress.toFixed(0)}%</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-blue-600 h-2 rounded-full transition-all"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Plan Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Plan Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-600">Request Date</p>
                            <p className="font-medium text-gray-900">
                                {new Date(paymentPlan.requestDate).toLocaleDateString()}
                            </p>
                        </div>
                        {paymentPlan.approvedDate && (
                            <div>
                                <p className="text-gray-600">Approved Date</p>
                                <p className="font-medium text-gray-900">
                                    {new Date(paymentPlan.approvedDate).toLocaleDateString()}
                                </p>
                            </div>
                        )}
                        {paymentPlan.startDate && (
                            <div>
                                <p className="text-gray-600">Start Date</p>
                                <p className="font-medium text-gray-900">
                                    {new Date(paymentPlan.startDate).toLocaleDateString()}
                                </p>
                            </div>
                        )}
                        {paymentPlan.endDate && (
                            <div>
                                <p className="text-gray-600">End Date</p>
                                <p className="font-medium text-gray-900">
                                    {new Date(paymentPlan.endDate).toLocaleDateString()}
                                </p>
                            </div>
                        )}
                        <div>
                            <p className="text-gray-600">Installment Amount</p>
                            <p className="font-medium text-gray-900">
                                ${paymentPlan.installmentAmount.toLocaleString('en-AU', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-600">Frequency</p>
                            <p className="font-medium text-gray-900 capitalize">
                                {paymentPlan.installmentFrequency}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-600">Interest Waiver</p>
                            <p className="font-medium text-gray-900">
                                {paymentPlan.requestInterestWaiver ? (
                                    paymentPlan.interestWaived ? (
                                        <span className="text-green-600">✓ Granted</span>
                                    ) : (
                                        <span className="text-amber-600">Requested</span>
                                    )
                                ) : (
                                    'Not requested'
                                )}
                            </p>
                        </div>
                    </div>
                    {paymentPlan.refusalReason && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                            <p className="text-sm font-medium text-red-900">Refusal Reason:</p>
                            <p className="text-sm text-red-700 mt-1">{paymentPlan.refusalReason}</p>
                        </div>
                    )}
                    {paymentPlan.notes && (
                        <div className="mt-4 p-3 bg-gray-50 border rounded">
                            <p className="text-sm font-medium text-gray-900">Notes:</p>
                            <p className="text-sm text-gray-700 mt-1">{paymentPlan.notes}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Payment Schedule */}
            <Card>
                <CardHeader>
                    <CardTitle>Payment Schedule</CardTitle>
                    <CardDescription>Installment payment history and upcoming payments</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {paymentPlan.payments.map((payment) => {
                            const isPaid = payment.status === 'paid';
                            const isOverdue = payment.status === 'overdue';
                            const isPending = payment.status === 'pending';

                            return (
                                <div 
                                    key={payment.id} 
                                    className={`p-4 border rounded-lg ${
                                        isPaid ? 'bg-green-50 border-green-200' : 
                                        isOverdue ? 'bg-red-50 border-red-200' : 
                                        'bg-gray-50'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {isPaid ? (
                                                <CheckCircle className="h-5 w-5 text-green-600" />
                                            ) : isOverdue ? (
                                                <XCircle className="h-5 w-5 text-red-600" />
                                            ) : (
                                                <Clock className="h-5 w-5 text-gray-400" />
                                            )}
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    Installment #{payment.installmentNumber}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Due: {new Date(payment.dueDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-gray-900">
                                                ${payment.amount.toLocaleString('en-AU', { minimumFractionDigits: 2 })}
                                            </p>
                                            {isPaid && payment.paidDate && (
                                                <p className="text-xs text-green-600">
                                                    Paid: {new Date(payment.paidDate).toLocaleDateString()}
                                                </p>
                                            )}
                                            <Badge className={
                                                isPaid ? 'bg-green-100 text-green-800' :
                                                isOverdue ? 'bg-red-100 text-red-800' :
                                                'bg-gray-100 text-gray-800'
                                            }>
                                                {payment.status}
                                            </Badge>
                                        </div>
                                    </div>
                                    {payment.paymentReference && (
                                        <p className="text-xs text-gray-500 mt-2">
                                            Reference: {payment.paymentReference}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Extension Requests */}
            {paymentPlan.extensions.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Extension Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {paymentPlan.extensions.map((extension) => (
                                <div key={extension.id} className="p-4 border rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                Requested: {new Date(extension.requestDate).toLocaleDateString()}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                New end date: {new Date(extension.requestedEndDate).toLocaleDateString()}
                                            </p>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Reason: {extension.reason}
                                            </p>
                                        </div>
                                        <Badge className={
                                            extension.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            extension.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                            'bg-amber-100 text-amber-800'
                                        }>
                                            {extension.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Actions */}
            {paymentPlan.status === 'pending' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Review Actions</CardTitle>
                        <CardDescription>Approve or reject this payment plan request</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-3">
                            <Button className="flex-1">
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve Plan
                            </Button>
                            <Button variant="destructive" className="flex-1">
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject Plan
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
