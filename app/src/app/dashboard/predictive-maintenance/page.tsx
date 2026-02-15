import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { verifySession } from "@/lib/session";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import {
    Brain, AlertTriangle, TrendingUp, Wrench, Calendar,
    DollarSign, Clock, CheckCircle2, Activity, Zap
} from "lucide-react";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";

export default async function PredictiveMaintenancePage() {
    const session = await verifySession();
    if (!session?.isAuth) redirect("/auth/login");

    const membership = await db.buildingMembership.findFirst({
        where: { userId: session.userId, status: "active" },
        include: { building: true }
    });

    if (!membership) redirect("/dashboard");

    // Fetch equipment and predictions
    const equipment = await db.equipment.findMany({
        where: { buildingId: membership.buildingId },
        include: {
            predictions: {
                where: { status: "pending" },
                orderBy: { probability: "desc" }
            },
            _count: { select: { predictions: true } }
        },
        orderBy: { status: "asc" }
    });

    const allPredictions = await db.maintenancePrediction.findMany({
        where: {
            equipment: { buildingId: membership.buildingId },
            status: "pending"
        },
        include: {
            equipment: { select: { name: true, type: true } }
        },
        orderBy: [
            { severity: "desc" },
            { probability: "desc" }
        ]
    });

    const criticalPredictions = allPredictions.filter(p => p.severity === "critical" || p.severity === "high");
    
    const totalCost = allPredictions.reduce((sum, p) => sum + (p.estimatedCost || 0), 0);
    const totalDowntime = allPredictions.reduce((sum, p) => sum + (p.estimatedDowntime || 0), 0);

    const statusConfig = {
        operational: { color: "bg-emerald-500/10 text-emerald-700", label: "Operational", dot: "bg-emerald-500" },
        maintenance_needed: { color: "bg-amber-500/10 text-amber-700", label: "Maintenance Needed", dot: "bg-amber-500" },
        critical: { color: "bg-red-500/10 text-red-700", label: "Critical", dot: "bg-red-500" },
        offline: { color: "bg-slate-500/10 text-slate-700", label: "Offline", dot: "bg-slate-500" },
    };

    const severityConfig = {
        low: { color: "text-blue-600", bg: "bg-blue-50", badge: "bg-blue-500/10 text-blue-700" },
        medium: { color: "text-amber-600", bg: "bg-amber-50", badge: "bg-amber-500/10 text-amber-700" },
        high: { color: "text-orange-600", bg: "bg-orange-50", badge: "bg-orange-500/10 text-orange-700" },
        critical: { color: "text-red-600", bg: "bg-red-50", badge: "bg-red-500/10 text-red-700" },
    };

    return (
        <div className="max-w-[1400px] mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Brain className="h-6 w-6 text-purple-600" />
                        <h1 className="text-2xl font-bold text-slate-900">AI Predictive Maintenance</h1>
                    </div>
                    <p className="text-sm text-slate-600">
                        Predict equipment failures before they happen with AI-powered analytics
                    </p>
                </div>
                <Link href="/dashboard/predictive-maintenance/equipment">
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                        <Wrench className="h-4 w-4 mr-2" />
                        Manage Equipment
                    </Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-slate-200">
                    <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                            <div className="w-9 h-9 rounded bg-purple-100 flex items-center justify-center">
                                <Brain className="h-4 w-4 text-purple-600" />
                            </div>
                            <TrendingUp className="h-4 w-4 text-purple-500" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-2xl font-semibold text-slate-900">{allPredictions.length}</p>
                            <p className="text-xs text-slate-500">Active Predictions</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200">
                    <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                            <div className="w-9 h-9 rounded bg-red-100 flex items-center justify-center">
                                <AlertTriangle className="h-4 w-4 text-red-600" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-2xl font-semibold text-slate-900">{criticalPredictions.length}</p>
                            <p className="text-xs text-slate-500">Critical Issues</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200">
                    <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                            <div className="w-9 h-9 rounded bg-emerald-100 flex items-center justify-center">
                                <DollarSign className="h-4 w-4 text-emerald-600" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-2xl font-semibold text-slate-900">
                                ${(totalCost / 1000).toFixed(1)}k
                            </p>
                            <p className="text-xs text-slate-500">Estimated Costs</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200">
                    <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                            <div className="w-9 h-9 rounded bg-amber-100 flex items-center justify-center">
                                <Clock className="h-4 w-4 text-amber-600" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-2xl font-semibold text-slate-900">{totalDowntime}h</p>
                            <p className="text-xs text-slate-500">Est. Downtime</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Critical Predictions Alert */}
            {criticalPredictions.length > 0 && (
                <Card className="border-red-200 bg-red-50/50">
                    <div className="px-5 py-4 border-b border-red-200 bg-red-100/50">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                            <h3 className="text-sm font-semibold text-red-900">Critical Predictions</h3>
                            <Badge className="bg-red-600 text-white">{criticalPredictions.length}</Badge>
                        </div>
                    </div>
                    <CardContent className="p-0">
                        <div className="divide-y divide-red-100">
                            {criticalPredictions.map((prediction) => {
                                const severity = severityConfig[prediction.severity as keyof typeof severityConfig];
                                const daysUntil = Math.ceil((prediction.estimatedDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

                                return (
                                    <div key={prediction.id} className="px-5 py-4 hover:bg-red-50 transition-colors">
                                        <div className="flex items-start gap-4">
                                            <div className={`w-12 h-12 rounded-lg ${severity.bg} flex items-center justify-center flex-shrink-0`}>
                                                <AlertTriangle className={`h-6 w-6 ${severity.color}`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <div>
                                                        <h4 className="text-sm font-semibold text-slate-900 mb-1">
                                                            {prediction.equipment.name} - {prediction.predictedIssue}
                                                        </h4>
                                                        <p className="text-sm text-slate-600 mb-2">
                                                            {prediction.description}
                                                        </p>
                                                        <p className="text-sm text-slate-700 font-medium">
                                                            {prediction.recommendedAction}
                                                        </p>
                                                    </div>
                                                    <Badge className={severity.badge}>
                                                        {Math.round(prediction.probability * 100)}% likely
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {daysUntil} days until failure
                                                    </span>
                                                    {prediction.estimatedCost && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="flex items-center gap-1">
                                                                <DollarSign className="h-3 w-3" />
                                                                ${prediction.estimatedCost.toLocaleString()}
                                                            </span>
                                                        </>
                                                    )}
                                                    {prediction.estimatedDowntime && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="h-3 w-3" />
                                                                {prediction.estimatedDowntime}h downtime
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Equipment List */}
            <Card className="border-slate-200">
                <div className="px-5 py-4 border-b border-slate-100">
                    <h3 className="text-sm font-semibold text-slate-900">Equipment Status</h3>
                </div>
                <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                        {equipment.map((item) => {
                            const status = statusConfig[item.status as keyof typeof statusConfig];
                            const hasPredictions = item.predictions.length > 0;
                            const highestPrediction = item.predictions[0];

                            return (
                                <Link
                                    key={item.id}
                                    href={`/dashboard/predictive-maintenance/equipment/${item.id}`}
                                    className="block px-5 py-4 hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                                                <Activity className="h-6 w-6 text-slate-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="text-sm font-semibold text-slate-900">
                                                        {item.name}
                                                    </h4>
                                                    <Badge className={status.color}>
                                                        {status.label}
                                                    </Badge>
                                                    {hasPredictions && (
                                                        <Badge className="bg-purple-500/10 text-purple-700">
                                                            {item.predictions.length} prediction{item.predictions.length > 1 ? 's' : ''}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                                                    <span className="capitalize">{item.type.replace(/_/g, " ")}</span>
                                                    {item.location && (
                                                        <>
                                                            <span>•</span>
                                                            <span>{item.location}</span>
                                                        </>
                                                    )}
                                                    {item.manufacturer && (
                                                        <>
                                                            <span>•</span>
                                                            <span>{item.manufacturer}</span>
                                                        </>
                                                    )}
                                                </div>
                                                {highestPrediction && (
                                                    <div className="flex items-center gap-2 text-xs">
                                                        <Brain className="h-3 w-3 text-purple-600" />
                                                        <span className="text-slate-700">
                                                            <span className="font-medium">{highestPrediction.predictedIssue}</span>
                                                            {" "}({Math.round(highestPrediction.probability * 100)}% probability)
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {item.nextService && (
                                            <div className="text-right">
                                                <p className="text-xs text-slate-500 mb-1">Next Service</p>
                                                <p className="text-sm font-medium text-slate-900">
                                                    {format(item.nextService, "MMM d, yyyy")}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
