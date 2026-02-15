import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Hash, DollarSign, Shield, AlertCircle, Calendar, Edit, Users, Home } from "lucide-react";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";
import { format, isBefore, differenceInDays } from "date-fns";

export default async function BuildingProfilePage() {
    const session = await verifySession();

    if (!session?.isAuth) {
        redirect("/auth/login");
    }

    // Get user's building
    const membership = await db.buildingMembership.findFirst({
        where: { userId: session.userId, status: "active" },
        include: { 
            building: {
                include: {
                    lots: true,
                    memberships: {
                        where: { status: "active" },
                        include: { user: true }
                    }
                }
            }
        }
    });

    if (!membership) {
        return (
            <div className="flex flex-col gap-6 p-6">
                <h1 className="text-2xl font-bold text-slate-900">Building Profile</h1>
                <Card className="border-amber-200 bg-amber-50">
                    <CardContent className="pt-6">
                        <p className="text-amber-900">You are not assigned to any building.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const building = membership.building;
    
    // Calculate insurance status
    const insuranceStatus = building.insuranceExpiry ? (() => {
        const daysUntilExpiry = differenceInDays(building.insuranceExpiry, new Date());
        if (daysUntilExpiry < 0) {
            return { status: "expired", color: "rose", label: "Expired", days: Math.abs(daysUntilExpiry) };
        } else if (daysUntilExpiry <= 30) {
            return { status: "expiring", color: "amber", label: "Expiring Soon", days: daysUntilExpiry };
        } else {
            return { status: "valid", color: "emerald", label: "Valid", days: daysUntilExpiry };
        }
    })() : null;

    // Check if user can edit (manager or admin)
    const canEdit = ["manager", "admin"].includes(membership.role);

    return (
        <div className="flex flex-col gap-6 p-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Building Profile</h1>
                    <p className="text-slate-600 mt-1">Building information and settings</p>
                </div>
                {canEdit && (
                    <Link href="/dashboard/building/edit">
                        <Button className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-md">
                            <Edit className="mr-2 h-4 w-4" /> Edit Details
                        </Button>
                    </Link>
                )}
            </div>

            {/* Building Header Card */}
            <Card className="shadow-lg border-t-4 border-t-indigo-500">
                <CardContent className="pt-8">
                    <div className="flex items-start gap-6">
                        {/* Building Icon */}
                        <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <Building2 className="h-10 w-10 text-white" />
                        </div>
                        
                        {/* Building Info */}
                        <div className="flex-1">
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">{building.name}</h2>
                            <div className="flex items-center gap-2 text-slate-600 mb-4">
                                <MapPin className="h-5 w-5 text-slate-400" />
                                <span className="text-lg">
                                    {building.address}, {building.suburb}, {building.state} {building.postcode}
                                </span>
                            </div>
                            
                            {/* Quick Stats */}
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-lg">
                                    <Home className="h-5 w-5 text-amber-600" />
                                    <div>
                                        <div className="text-2xl font-bold text-amber-600">{building.lots.length}</div>
                                        <div className="text-xs text-slate-600">Total Lots</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-lg">
                                    <Users className="h-5 w-5 text-emerald-600" />
                                    <div>
                                        <div className="text-2xl font-bold text-emerald-600">{building.memberships.length}</div>
                                        <div className="text-xs text-slate-600">Active Members</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Strata Details */}
                <Card>
                    <CardHeader className="bg-slate-50 border-b">
                        <CardTitle className="flex items-center gap-2">
                            <Hash className="h-5 w-5 text-amber-600" />
                            Strata Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div>
                            <label className="text-sm font-medium text-slate-600">Strata Plan Number</label>
                            <p className="text-lg font-semibold text-slate-900 mt-1">
                                {building.strataPlanNumber || "Not set"}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-600">State</label>
                            <p className="text-lg font-semibold text-slate-900 mt-1">{building.state}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-600">Total Lots</label>
                            <p className="text-lg font-semibold text-slate-900 mt-1">{building.totalLots || building.lots.length}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Financial Summary */}
                <Card>
                    <CardHeader className="bg-slate-50 border-b">
                        <CardTitle className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-emerald-600" />
                            Financial Summary
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div>
                            <label className="text-sm font-medium text-slate-600">Administrative Fund</label>
                            <p className="text-2xl font-bold text-emerald-600 mt-1">
                                ${building.adminFundBalance.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-600">Capital Works Fund</label>
                            <p className="text-2xl font-bold text-blue-600 mt-1">
                                ${building.capitalWorksBalance.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className="pt-2 border-t">
                            <label className="text-sm font-medium text-slate-600">Total Funds</label>
                            <p className="text-2xl font-bold text-slate-900 mt-1">
                                ${(building.adminFundBalance + building.capitalWorksBalance).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Insurance Status */}
                <Card className="md:col-span-2">
                    <CardHeader className="bg-slate-50 border-b">
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-blue-600" />
                            Insurance Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {building.insuranceExpiry ? (
                            <div className="flex items-start gap-4">
                                <div className={`flex-shrink-0 w-16 h-16 bg-${insuranceStatus?.color}-100 rounded-xl flex items-center justify-center`}>
                                    {insuranceStatus?.status === "expired" ? (
                                        <AlertCircle className={`h-8 w-8 text-${insuranceStatus?.color}-600`} />
                                    ) : (
                                        <Shield className={`h-8 w-8 text-${insuranceStatus?.color}-600`} />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Badge className={`bg-${insuranceStatus?.color}-100 text-${insuranceStatus?.color}-700 border-${insuranceStatus?.color}-200`}>
                                            {insuranceStatus?.label}
                                        </Badge>
                                        <span className="text-sm text-slate-600">
                                            {insuranceStatus?.status === "expired" 
                                                ? `Expired ${insuranceStatus.days} days ago`
                                                : `${insuranceStatus?.days} days remaining`
                                            }
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Calendar className="h-4 w-4 text-slate-400" />
                                        <span>Expiry Date: {format(building.insuranceExpiry, "MMMM d, yyyy")}</span>
                                    </div>
                                    {insuranceStatus?.status === "expired" && (
                                        <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-lg">
                                            <p className="text-sm text-rose-800 font-medium">
                                                ⚠️ Insurance has expired. Please renew immediately to maintain coverage.
                                            </p>
                                        </div>
                                    )}
                                    {insuranceStatus?.status === "expiring" && (
                                        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                            <p className="text-sm text-amber-800 font-medium">
                                                ⏰ Insurance expiring soon. Please arrange renewal.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                    <Shield className="h-8 w-8 text-slate-400" />
                                </div>
                                <p className="text-slate-600">No insurance expiry date set</p>
                                {canEdit && (
                                    <Link href="/dashboard/building/edit">
                                        <Button variant="outline" className="mt-4">
                                            Add Insurance Details
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Australian Compliance Info */}
            <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                    <div className="flex gap-3">
                        <div className="text-2xl">🇦🇺</div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-blue-900 mb-1">Australian Strata Compliance</h4>
                            <p className="text-sm text-blue-800 mb-3">
                                Building information is maintained in accordance with NSW Strata Schemes Management Act 2015.
                            </p>
                            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                                <li>Building insurance must comply with Section 160-162 (Insurance Requirements)</li>
                                <li>Financial records maintained per Section 102 (Duty to Keep Financial Records)</li>
                                <li>Strata roll updated per Section 177 (Strata Roll Requirements)</li>
                                <li>All funds held in accordance with Section 75 (Strata Schemes Management Fund)</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
