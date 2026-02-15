import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { verifySession } from "@/lib/session";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import {
    AlertTriangle, Phone, Shield, Flame, Droplet, Wind,
    Zap, Users, MapPin, Clock, CheckCircle2, XCircle
} from "lucide-react";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";

export default async function EmergencyPage() {
    const session = await verifySession();
    if (!session?.isAuth) redirect("/auth/login");

    const membership = await db.buildingMembership.findFirst({
        where: { userId: session.userId, status: "active" },
        include: { building: true }
    });

    if (!membership) redirect("/dashboard");

    // Fetch emergency data
    const activeAlerts = await db.emergencyAlert.findMany({
        where: {
            buildingId: membership.buildingId,
            status: "active"
        },
        include: {
            creator: { select: { name: true } },
            responses: true,
            _count: { select: { responses: true } }
        },
        orderBy: { createdAt: "desc" }
    });

    const recentAlerts = await db.emergencyAlert.findMany({
        where: {
            buildingId: membership.buildingId,
            status: { in: ["resolved", "false_alarm"] }
        },
        include: {
            creator: { select: { name: true } }
        },
        orderBy: { createdAt: "desc" },
        take: 5
    });

    const emergencyContacts = await db.emergencyContact.findMany({
        where: { buildingId: membership.buildingId },
        orderBy: [
            { isEmergency: "desc" },
            { isPrimary: "desc" },
            { name: "asc" }
        ]
    });

    const totalResidents = await db.buildingMembership.count({
        where: { buildingId: membership.buildingId, status: "active" }
    });

    const alertTypeConfig = {
        fire: { icon: Flame, color: "text-red-600", bg: "bg-red-50", label: "Fire" },
        flood: { icon: Droplet, color: "text-blue-600", bg: "bg-blue-50", label: "Flood" },
        gas: { icon: Wind, color: "text-orange-600", bg: "bg-orange-50", label: "Gas Leak" },
        security: { icon: Shield, color: "text-purple-600", bg: "bg-purple-50", label: "Security" },
        medical: { icon: AlertTriangle, color: "text-rose-600", bg: "bg-rose-50", label: "Medical" },
        weather: { icon: Wind, color: "text-slate-600", bg: "bg-slate-50", label: "Weather" },
        power: { icon: Zap, color: "text-yellow-600", bg: "bg-yellow-50", label: "Power Outage" },
        elevator: { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50", label: "Elevator" },
    };

    const severityConfig = {
        low: { color: "bg-blue-500/10 text-blue-700", label: "Low" },
        medium: { color: "bg-amber-500/10 text-amber-700", label: "Medium" },
        high: { color: "bg-orange-500/10 text-orange-700", label: "High" },
        critical: { color: "bg-red-500/10 text-red-700", label: "Critical" },
    };

    return (
        <div className="max-w-[1400px] mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Emergency Response</h1>
                    <p className="text-sm text-slate-600 mt-1">
                        Safety alerts, emergency contacts, and response coordination
                    </p>
                </div>
                <Link href="/dashboard/emergency/new">
                    <Button className="bg-red-600 hover:bg-red-700 text-white">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Report Emergency
                    </Button>
                </Link>
            </div>

            {/* Active Alerts */}
            {activeAlerts.length > 0 && (
                <Card className="border-red-200 bg-red-50/50">
                    <div className="px-5 py-4 border-b border-red-200 bg-red-100/50">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                            <h3 className="text-sm font-semibold text-red-900">Active Emergencies</h3>
                            <Badge className="bg-red-600 text-white">{activeAlerts.length}</Badge>
                        </div>
                    </div>
                    <CardContent className="p-0">
                        <div className="divide-y divide-red-100">
                            {activeAlerts.map((alert) => {
                                const typeConfig = alertTypeConfig[alert.type as keyof typeof alertTypeConfig];
                                const Icon = typeConfig.icon;
                                const responseRate = totalResidents > 0 
                                    ? Math.round((alert._count.responses / totalResidents) * 100)
                                    : 0;

                                return (
                                    <Link
                                        key={alert.id}
                                        href={`/dashboard/emergency/${alert.id}`}
                                        className="block px-5 py-4 hover:bg-red-50 transition-colors"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`w-12 h-12 rounded-lg ${typeConfig.bg} flex items-center justify-center flex-shrink-0`}>
                                                <Icon className={`h-6 w-6 ${typeConfig.color}`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <div>
                                                        <h4 className="text-sm font-semibold text-slate-900 mb-1">
                                                            {alert.title}
                                                        </h4>
                                                        <p className="text-sm text-slate-600 line-clamp-2">
                                                            {alert.description}
                                                        </p>
                                                    </div>
                                                    <Badge className={severityConfig[alert.severity as keyof typeof severityConfig].color}>
                                                        {severityConfig[alert.severity as keyof typeof severityConfig].label}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {formatDistanceToNow(alert.createdAt, { addSuffix: true })}
                                                    </span>
                                                    {alert.location && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="flex items-center gap-1">
                                                                <MapPin className="h-3 w-3" />
                                                                {alert.location}
                                                            </span>
                                                        </>
                                                    )}
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1">
                                                        <Users className="h-3 w-3" />
                                                        {alert._count.responses} / {totalResidents} responded ({responseRate}%)
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Emergency Contacts */}
                <div className="lg:col-span-2">
                    <Card className="border-slate-200">
                        <div className="px-5 py-4 border-b border-slate-100">
                            <h3 className="text-sm font-semibold text-slate-900">Emergency Contacts</h3>
                        </div>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-100">
                                {emergencyContacts.map((contact) => (
                                    <div key={contact.id} className="px-5 py-4 hover:bg-slate-50 transition-colors">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="text-sm font-medium text-slate-900">
                                                        {contact.name}
                                                    </h4>
                                                    {contact.isEmergency && (
                                                        <Badge className="bg-red-500/10 text-red-700 text-xs">
                                                            Emergency
                                                        </Badge>
                                                    )}
                                                    {contact.isPrimary && (
                                                        <Badge className="bg-blue-500/10 text-blue-700 text-xs">
                                                            Primary
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-xs text-slate-500 capitalize mb-2">
                                                    {contact.role.replace(/_/g, " ")}
                                                </p>
                                                <div className="flex items-center gap-4">
                                                    <a
                                                        href={`tel:${contact.phone}`}
                                                        className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700"
                                                    >
                                                        <Phone className="h-3.5 w-3.5" />
                                                        {contact.phone}
                                                    </a>
                                                    {contact.email && (
                                                        <a
                                                            href={`mailto:${contact.email}`}
                                                            className="text-sm text-slate-600 hover:text-slate-900"
                                                        >
                                                            {contact.email}
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                            <a href={`tel:${contact.phone}`}>
                                                <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                                                    <Phone className="h-3.5 w-3.5 mr-1" />
                                                    Call
                                                </Button>
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Alerts */}
                <div>
                    <Card className="border-slate-200">
                        <div className="px-5 py-4 border-b border-slate-100">
                            <h3 className="text-sm font-semibold text-slate-900">Recent Alerts</h3>
                        </div>
                        <CardContent className="p-0">
                            {recentAlerts.length === 0 ? (
                                <div className="py-12 text-center">
                                    <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                                    <p className="text-sm text-slate-600">No recent alerts</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {recentAlerts.map((alert) => {
                                        const typeConfig = alertTypeConfig[alert.type as keyof typeof alertTypeConfig];
                                        const Icon = typeConfig.icon;

                                        return (
                                            <div key={alert.id} className="px-5 py-3">
                                                <div className="flex items-start gap-3">
                                                    <div className={`w-8 h-8 rounded ${typeConfig.bg} flex items-center justify-center flex-shrink-0`}>
                                                        <Icon className={`h-4 w-4 ${typeConfig.color}`} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-medium text-slate-900 mb-1">
                                                            {alert.title}
                                                        </h4>
                                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                                            <span>{format(alert.createdAt, "MMM d")}</span>
                                                            <span>•</span>
                                                            {alert.status === "resolved" ? (
                                                                <span className="flex items-center gap-1 text-emerald-600">
                                                                    <CheckCircle2 className="h-3 w-3" />
                                                                    Resolved
                                                                </span>
                                                            ) : (
                                                                <span className="flex items-center gap-1 text-slate-500">
                                                                    <XCircle className="h-3 w-3" />
                                                                    False Alarm
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
