import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, DollarSign, Calendar, AlertCircle, CheckCircle, Clock, User, Home } from "lucide-react";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";
import { format, isBefore, differenceInDays } from "date-fns";

function getStatusBadge(status: string, dueDate: Date) {
    if (status === "paid") {
        return { color: "bg-emerald-100 text-emerald-700 border-emerald-200", label: "Paid", icon: CheckCircle };
    }
    
    if (status === "overdue" || (status === "pending" && isBefore(dueDate, new Date()))) {
        return { color: "bg-rose-100 text-rose-700 border-rose-200", label: "Overdue", icon: AlertCircle };
    }
    
    return { color: "bg-amber-100 text-amber-700 border-amber-200", label: "Pending", icon: Clock };
}

export default async function LeviesPage() {
    const session = await verifySession();

    if (!session?.isAuth) {
        redirect("/auth/login");
    }

    // Get user's building membership
    const membership = await db.buildingMembership.findFirst({
        where: { userId: session.userId, status: "active" },
        include: { 
            building: true,
            lot: true
        }
    });

    if (!membership) {
        return (
            <div className="flex flex-col gap-6 p-6">
                <h1 className="text-2xl font-bold text-slate-900">Levies</h1>
                <Card className="border-amber-200 bg-amber-50">
                    <CardContent className="pt-6">
                        <p className="text-amber-900">You are not assigned to any building.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const isManager = ["manager", "admin"].includes(membership.role);

    // Get levies - managers see all, owners see their own
    const levies = await db.levy.findMany({
        where: isManager 
            ? { buildingId: membership.buildingId }
            : { 
                buildingId: membership.buildingId,
                lotId: membership.lotId || undefined
            },
        orderBy: { dueDate: "desc" },
        include: {
            lot: true
        }
    });

    // Calculate stats
    const stats = {
        total: levies.length,
        paid: levies.filter((l: typeof levies[0]) => l.status === "paid").length,
        pending: levies.filter((l: typeof levies[0]) => l.status === "pending").length,
        overdue: levies.filter((l: typeof levies[0]) => {
            return l.status === "pending" && isBefore(l.dueDate, new Date());
        }).length,
        totalAmount: levies.reduce((sum: number, l: typeof levies[0]) => sum + l.amount, 0),
        paidAmount: levies
            .filter((l: typeof levies[0]) => l.status === "paid")
            .reduce((sum: number, l: typeof levies[0]) => sum + l.amount, 0),
        outstandingAmount: levies
            .filter((l: typeof levies[0]) => l.status !== "paid")
            .reduce((sum: number, l: typeof levies[0]) => sum + l.amount, 0),
    };

    return (
        <div className="flex flex-col gap-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Levies</h1>
                    <p className="text-slate-600 mt-1">
                        {isManager ? "Manage building levies" : "Your levy payments"}
                    </p>
                </div>
                {isManager && (
                    <Link href="/dashboard/finance/levies/new">
                        <Button className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-md">
                            <Plus className="mr-2 h-4 w-4" /> Create Levy
                        </Button>
                    </Link>
                )}
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="border-l-4 border-l-indigo-500">
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
                        <p className="text-xs text-slate-600 mt-1">Total Levies</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-emerald-500">
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-emerald-600">{stats.paid}</div>
                        <p className="text-xs text-slate-600 mt-1">Paid</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-amber-500">
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
                        <p className="text-xs text-slate-600 mt-1">Pending</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-rose-500">
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-rose-600">{stats.overdue}</div>
                        <p className="text-xs text-slate-600 mt-1">Overdue</p>
                    </CardContent>
                </Card>
            </div>

            {/* Financial Summary */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="shadow-sm">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-medium text-slate-600">Total Amount</div>
                            <DollarSign className="h-5 w-5 text-indigo-500" />
                        </div>
                        <div className="text-2xl font-bold text-amber-600">
                            ${stats.totalAmount.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-medium text-slate-600">Paid Amount</div>
                            <CheckCircle className="h-5 w-5 text-emerald-500" />
                        </div>
                        <div className="text-2xl font-bold text-emerald-600">
                            ${stats.paidAmount.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-medium text-slate-600">Outstanding</div>
                            <AlertCircle className="h-5 w-5 text-rose-500" />
                        </div>
                        <div className="text-2xl font-bold text-rose-600">
                            ${stats.outstandingAmount.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Levies List */}
            <Card className="shadow-sm">
                <CardHeader className="bg-slate-50 border-b">
                    <CardTitle>
                        {isManager ? "All Levies" : "Your Levies"}
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    {levies.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <DollarSign className="h-8 w-8 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">No levies yet</h3>
                            <p className="text-slate-600 mb-6">
                                {isManager 
                                    ? "Create your first levy to start collecting payments"
                                    : "No levies have been issued for your lot"
                                }
                            </p>
                            {isManager && (
                                <Link href="/dashboard/finance/levies/new">
                                    <Button className="bg-gradient-primary">
                                        <Plus className="mr-2 h-4 w-4" /> Create First Levy
                                    </Button>
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {levies.map((levy: typeof levies[0]) => {
                                const statusBadge = getStatusBadge(levy.status, levy.dueDate);
                                const StatusIcon = statusBadge.icon;
                                const daysUntilDue = differenceInDays(levy.dueDate, new Date());
                                const isOverdue = levy.status === "pending" && daysUntilDue < 0;

                                return (
                                    <div 
                                        key={levy.id}
                                        className={`flex items-center justify-between p-4 rounded-lg border hover:shadow-md transition-shadow ${
                                            isOverdue ? "border-rose-200 bg-rose-50/30" : "bg-white"
                                        }`}
                                    >
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                                levy.status === "paid" 
                                                    ? "bg-emerald-100" 
                                                    : isOverdue
                                                    ? "bg-rose-100"
                                                    : "bg-amber-100"
                                            }`}>
                                                <DollarSign className={`h-6 w-6 ${
                                                    levy.status === "paid" 
                                                        ? "text-emerald-600" 
                                                        : isOverdue
                                                        ? "text-rose-600"
                                                        : "text-amber-600"
                                                }`} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h4 className="font-semibold text-slate-900">{levy.period}</h4>
                                                    <Badge className={statusBadge.color}>
                                                        <StatusIcon className="h-3 w-3 mr-1" />
                                                        {statusBadge.label}
                                                    </Badge>
                                                </div>
                                                <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                                                    {isManager && (
                                                        <div className="flex items-center gap-1">
                                                            <Home className="h-4 w-4 text-slate-400" />
                                                            <span>Unit {levy.lot.unitNumber}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-4 w-4 text-slate-400" />
                                                        <span>Due {format(levy.dueDate, "MMM d, yyyy")}</span>
                                                    </div>
                                                    {isOverdue && (
                                                        <>
                                                            <span className="text-rose-600 font-medium">
                                                                • {Math.abs(daysUntilDue)} days overdue
                                                            </span>
                                                        </>
                                                    )}
                                                    {levy.status === "paid" && levy.paidAt && (
                                                        <span className="text-emerald-600">
                                                            • Paid {format(levy.paidAt, "MMM d, yyyy")}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-slate-900">
                                                ${levy.amount.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </div>
                                            {levy.status === "pending" && !isManager && (
                                                <Button size="sm" className="mt-2 bg-gradient-primary">
                                                    Pay Now
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Australian Compliance Info */}
            <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                    <div className="flex gap-3">
                        <div className="text-2xl">🇦🇺</div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-blue-900 mb-1">Levy Requirements & Compliance</h4>
                            <p className="text-sm text-blue-800 mb-3">
                                All levies are managed in accordance with NSW Strata Schemes Management Act 2015.
                            </p>
                            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                                <li>Section 76: Contributions to administrative and capital works funds</li>
                                <li>Section 77: Determination of contributions by owners corporation</li>
                                <li>Section 85: Recovery of unpaid contributions</li>
                                <li>Section 86: Interest on unpaid contributions (maximum 10% per annum)</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
