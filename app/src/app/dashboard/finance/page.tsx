import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, DollarSign, TrendingUp, TrendingDown, Calendar, FileText, AlertCircle, Download } from "lucide-react";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";
import { format } from "date-fns";

export default async function FinancePage() {
    const session = await verifySession();

    if (!session?.isAuth) {
        redirect("/auth/login");
    }

    // Get user's building
    const membership = await db.buildingMembership.findFirst({
        where: { userId: session.userId, status: "active" },
        include: { building: true }
    });

    if (!membership) {
        return (
            <div className="flex flex-col gap-6 p-6">
                <h1 className="text-2xl font-bold text-slate-900">Finance</h1>
                <Card className="border-amber-200 bg-amber-50">
                    <CardContent className="pt-6">
                        <p className="text-amber-900">You are not assigned to any building.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const building = membership.building;

    // Get recent transactions
    const transactions = await db.transaction.findMany({
        where: { buildingId: membership.buildingId },
        orderBy: { date: "desc" },
        take: 10,
        include: {
            approver: { select: { name: true } }
        }
    });

    // Calculate stats
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const monthlyIncome = transactions
        .filter((t: typeof transactions[0]) => t.type === "income" && t.date >= currentMonth)
        .reduce((sum: number, t: typeof transactions[0]) => sum + t.amount, 0);

    const monthlyExpenses = transactions
        .filter((t: typeof transactions[0]) => t.type === "expense" && t.date >= currentMonth)
        .reduce((sum: number, t: typeof transactions[0]) => sum + Math.abs(t.amount), 0);

    const stats = {
        adminFund: building.adminFundBalance,
        capitalWorks: building.capitalWorksBalance,
        totalFunds: building.adminFundBalance + building.capitalWorksBalance,
        monthlyIncome,
        monthlyExpenses,
        netCashFlow: monthlyIncome - monthlyExpenses,
    };

    // Check if user can manage (manager or admin)
    const canManage = ["manager", "admin"].includes(membership.role);

    return (
        <div className="flex flex-col gap-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Finance</h1>
                    <p className="text-slate-600 mt-1">Financial overview and transactions</p>
                </div>
                {canManage && (
                    <div className="flex gap-3">
                        <Link href="/dashboard/finance/transactions/new">
                            <Button variant="outline" className="shadow-sm">
                                <Plus className="mr-2 h-4 w-4" /> Add Transaction
                            </Button>
                        </Link>
                        <Button className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-md">
                            <Download className="mr-2 h-4 w-4" /> Export Report
                        </Button>
                    </div>
                )}
            </div>

            {/* Fund Balances */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-l-4 border-l-emerald-500 shadow-md">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-medium text-slate-600">Administrative Fund</div>
                            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <DollarSign className="h-5 w-5 text-emerald-600" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-emerald-600">
                            ${stats.adminFund.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <p className="text-xs text-slate-500 mt-2">For day-to-day expenses</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500 shadow-md">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-medium text-slate-600">Capital Works Fund</div>
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <DollarSign className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-blue-600">
                            ${stats.capitalWorks.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <p className="text-xs text-slate-500 mt-2">For major repairs & upgrades</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-indigo-500 shadow-md">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-medium text-slate-600">Total Funds</div>
                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                <DollarSign className="h-5 w-5 text-amber-600" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-amber-600">
                            ${stats.totalFunds.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <p className="text-xs text-slate-500 mt-2">Combined balance</p>
                    </CardContent>
                </Card>
            </div>

            {/* Monthly Summary */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="shadow-sm">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-medium text-slate-600">Income (This Month)</div>
                            <TrendingUp className="h-5 w-5 text-emerald-500" />
                        </div>
                        <div className="text-2xl font-bold text-emerald-600">
                            ${stats.monthlyIncome.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-medium text-slate-600">Expenses (This Month)</div>
                            <TrendingDown className="h-5 w-5 text-rose-500" />
                        </div>
                        <div className="text-2xl font-bold text-rose-600">
                            ${stats.monthlyExpenses.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-medium text-slate-600">Net Cash Flow</div>
                            {stats.netCashFlow >= 0 ? (
                                <TrendingUp className="h-5 w-5 text-emerald-500" />
                            ) : (
                                <TrendingDown className="h-5 w-5 text-rose-500" />
                            )}
                        </div>
                        <div className={`text-2xl font-bold ${stats.netCashFlow >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            ${Math.abs(stats.netCashFlow).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Transactions */}
            <Card className="shadow-sm">
                <CardHeader className="bg-slate-50 border-b">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-amber-600" />
                            Recent Transactions
                        </CardTitle>
                        {canManage && (
                            <Link href="/dashboard/finance/transactions">
                                <Button variant="ghost" size="sm">
                                    View All →
                                </Button>
                            </Link>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    {transactions.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <FileText className="h-8 w-8 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">No transactions yet</h3>
                            <p className="text-slate-600 mb-6">Start tracking your building's finances</p>
                            {canManage && (
                                <Link href="/dashboard/finance/transactions/new">
                                    <Button className="bg-gradient-primary">
                                        <Plus className="mr-2 h-4 w-4" /> Add First Transaction
                                    </Button>
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {transactions.map((transaction: typeof transactions[0]) => (
                                <div 
                                    key={transaction.id}
                                    className="flex items-center justify-between p-4 rounded-lg border hover:shadow-md transition-shadow bg-white"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                            transaction.type === "income" 
                                                ? "bg-emerald-100" 
                                                : "bg-rose-100"
                                        }`}>
                                            {transaction.type === "income" ? (
                                                <TrendingUp className="h-6 w-6 text-emerald-600" />
                                            ) : (
                                                <TrendingDown className="h-6 w-6 text-rose-600" />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900">{transaction.description}</h4>
                                            <div className="flex items-center gap-3 text-sm text-slate-600 mt-1">
                                                <Badge variant="outline" className="text-xs">
                                                    {transaction.category}
                                                </Badge>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3 text-slate-400" />
                                                    <span>{format(transaction.date, "MMM d, yyyy")}</span>
                                                </div>
                                                {transaction.approver && (
                                                    <span className="text-slate-400">• Approved by {transaction.approver.name}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`text-xl font-bold ${
                                        transaction.type === "income" 
                                            ? "text-emerald-600" 
                                            : "text-rose-600"
                                    }`}>
                                        {transaction.type === "income" ? "+" : "-"}
                                        ${Math.abs(transaction.amount).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                </div>
                            ))}
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
                            <h4 className="font-semibold text-blue-900 mb-1">Financial Record Requirements</h4>
                            <p className="text-sm text-blue-800 mb-3">
                                All financial records are maintained in accordance with NSW Strata Schemes Management Act 2015.
                            </p>
                            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                                <li>Section 102: Duty to keep financial records (7 years retention)</li>
                                <li>Section 75: Administrative and Capital Works Funds must be maintained separately</li>
                                <li>Section 79: Annual financial statements required</li>
                                <li>Section 80: Audit requirements for schemes with 100+ lots</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
