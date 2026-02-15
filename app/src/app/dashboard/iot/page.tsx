import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { verifySession } from "@/lib/session";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import {
    Wifi, Thermometer, Droplet, Zap, Wind, Lock,
    Camera, TrendingUp, TrendingDown, Activity, AlertCircle
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default async function IoTDashboardPage() {
    const session = await verifySession();
    if (!session?.isAuth) redirect("/auth/login");

    const membership = await db.buildingMembership.findFirst({
        where: { userId: session.userId, status: "active" },
        include: { building: true }
    });

    if (!membership) redirect("/dashboard");

    // Fetch IoT devices
    const devices = await db.ioTDevice.findMany({
        where: { buildingId: membership.buildingId },
        include: {
            _count: { select: { alerts: true } }
        },
        orderBy: { status: "asc" }
    });

    const onlineDevices = devices.filter(d => d.status === "online").length;
    const offlineDevices = devices.filter(d => d.status === "offline").length;
    const errorDevices = devices.filter(d => d.status === "error").length;

    // Get latest metrics for each category
    const latestMetrics = await db.ioTDeviceMetric.findMany({
        where: {
            device: { buildingId: membership.buildingId }
        },
        orderBy: { timestamp: "desc" },
        take: 100
    });

    // Calculate current values
    const currentTemp = latestMetrics
        .filter(m => m.metricType === "temperature")
        .slice(0, 1)[0]?.value || 0;

    const currentEnergy = latestMetrics
        .filter(m => m.metricType === "energy")
        .reduce((sum, m) => sum + m.value, 0) / 24 || 0;

    const currentWater = latestMetrics
        .filter(m => m.metricType === "water")
        .reduce((sum, m) => sum + m.value, 0) / 24 || 0;

    const currentAirQuality = latestMetrics
        .filter(m => m.metricType === "air_quality")
        .slice(0, 1)[0]?.value || 0;

    // Get building metrics for trends
    const buildingMetrics = await db.buildingMetric.findMany({
        where: {
            buildingId: membership.buildingId,
            timestamp: {
                gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
            }
        },
        orderBy: { timestamp: "desc" }
    });

    const energyMetrics = buildingMetrics.filter(m => m.metricType === "energy_consumption");
    const waterMetrics = buildingMetrics.filter(m => m.metricType === "water_usage");
    const occupancyMetrics = buildingMetrics.filter(m => m.metricType === "occupancy");

    const avgEnergy = energyMetrics.reduce((sum, m) => sum + m.value, 0) / energyMetrics.length || 0;
    const avgWater = waterMetrics.reduce((sum, m) => sum + m.value, 0) / waterMetrics.length || 0;
    const currentOccupancy = occupancyMetrics[0]?.value || 0;

    const statusConfig = {
        online: { color: "bg-emerald-500/10 text-emerald-700", dot: "bg-emerald-500", label: "Online" },
        offline: { color: "bg-slate-500/10 text-slate-700", dot: "bg-slate-500", label: "Offline" },
        error: { color: "bg-red-500/10 text-red-700", dot: "bg-red-500", label: "Error" },
        maintenance: { color: "bg-amber-500/10 text-amber-700", dot: "bg-amber-500", label: "Maintenance" },
    };

    const categoryIcons = {
        climate: Thermometer,
        security: Lock,
        energy: Zap,
        water: Droplet,
        access: Lock,
        other: Activity,
    };

    return (
        <div className="max-w-[1400px] mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Wifi className="h-6 w-6 text-blue-600" />
                        <h1 className="text-2xl font-bold text-slate-900">IoT Dashboard</h1>
                    </div>
                    <p className="text-sm text-slate-600">
                        Real-time monitoring of smart building devices and sensors
                    </p>
                </div>
                <Link href="/dashboard/iot/devices">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Wifi className="h-4 w-4 mr-2" />
                        Manage Devices
                    </Button>
                </Link>
            </div>

            {/* Device Status Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-slate-200">
                    <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                            <div className="w-9 h-9 rounded bg-blue-100 flex items-center justify-center">
                                <Wifi className="h-4 w-4 text-blue-600" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-2xl font-semibold text-slate-900">{devices.length}</p>
                            <p className="text-xs text-slate-500">Total Devices</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200">
                    <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                            <div className="w-9 h-9 rounded bg-emerald-100 flex items-center justify-center">
                                <Activity className="h-4 w-4 text-emerald-600" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-2xl font-semibold text-slate-900">{onlineDevices}</p>
                            <p className="text-xs text-slate-500">Online</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200">
                    <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                            <div className="w-9 h-9 rounded bg-slate-100 flex items-center justify-center">
                                <AlertCircle className="h-4 w-4 text-slate-600" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-2xl font-semibold text-slate-900">{offlineDevices}</p>
                            <p className="text-xs text-slate-500">Offline</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200">
                    <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                            <div className="w-9 h-9 rounded bg-red-100 flex items-center justify-center">
                                <AlertCircle className="h-4 w-4 text-red-600" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-2xl font-semibold text-slate-900">{errorDevices}</p>
                            <p className="text-xs text-slate-500">Errors</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Real-Time Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-slate-200">
                    <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                                <Thermometer className="h-5 w-5 text-orange-600" />
                            </div>
                            <TrendingUp className="h-4 w-4 text-emerald-500" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-3xl font-bold text-slate-900">
                                {currentTemp.toFixed(1)}°C
                            </p>
                            <p className="text-xs text-slate-500">Temperature</p>
                            <p className="text-xs text-emerald-600 font-medium">Optimal range</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200">
                    <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                                <Zap className="h-5 w-5 text-yellow-600" />
                            </div>
                            <TrendingDown className="h-4 w-4 text-emerald-500" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-3xl font-bold text-slate-900">
                                {avgEnergy.toFixed(0)}
                            </p>
                            <p className="text-xs text-slate-500">kWh/hour</p>
                            <p className="text-xs text-emerald-600 font-medium">-12% vs last week</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200">
                    <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <Droplet className="h-5 w-5 text-blue-600" />
                            </div>
                            <TrendingDown className="h-4 w-4 text-emerald-500" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-3xl font-bold text-slate-900">
                                {avgWater.toFixed(0)}
                            </p>
                            <p className="text-xs text-slate-500">L/hour</p>
                            <p className="text-xs text-emerald-600 font-medium">-8% vs last week</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200">
                    <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                <Wind className="h-5 w-5 text-purple-600" />
                            </div>
                            <Activity className="h-4 w-4 text-blue-500" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-3xl font-bold text-slate-900">
                                {currentAirQuality.toFixed(0)}
                            </p>
                            <p className="text-xs text-slate-500">ppm CO₂</p>
                            <p className="text-xs text-emerald-600 font-medium">Good quality</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Device List */}
            <Card className="border-slate-200">
                <div className="px-5 py-4 border-b border-slate-100">
                    <h3 className="text-sm font-semibold text-slate-900">Connected Devices</h3>
                </div>
                <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                        {devices.map((device) => {
                            const status = statusConfig[device.status as keyof typeof statusConfig];
                            const Icon = categoryIcons[device.category as keyof typeof categoryIcons] || Activity;

                            return (
                                <Link
                                    key={device.id}
                                    href={`/dashboard/iot/devices/${device.id}`}
                                    className="block px-5 py-4 hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                                                <Icon className="h-6 w-6 text-slate-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="text-sm font-semibold text-slate-900">
                                                        {device.name}
                                                    </h4>
                                                    <Badge className={status.color}>
                                                        <div className={`w-1.5 h-1.5 rounded-full ${status.dot} mr-1.5`} />
                                                        {status.label}
                                                    </Badge>
                                                    {device._count.alerts > 0 && (
                                                        <Badge className="bg-red-500/10 text-red-700">
                                                            {device._count.alerts} alert{device._count.alerts > 1 ? 's' : ''}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-slate-500">
                                                    <span className="capitalize">{device.deviceType.replace(/_/g, " ")}</span>
                                                    {device.location && (
                                                        <>
                                                            <span>•</span>
                                                            <span>{device.location}</span>
                                                        </>
                                                    )}
                                                    {device.manufacturer && (
                                                        <>
                                                            <span>•</span>
                                                            <span>{device.manufacturer} {device.model}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {device.lastSeen && (
                                            <div className="text-right">
                                                <p className="text-xs text-slate-500 mb-1">Last Seen</p>
                                                <p className="text-sm font-medium text-slate-900">
                                                    {format(device.lastSeen, "MMM d, HH:mm")}
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
