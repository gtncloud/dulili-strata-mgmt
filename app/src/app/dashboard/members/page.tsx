import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Mail, Phone, Building2, User, Shield, Users, Home } from "lucide-react";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";

function getRoleBadge(role: string) {
    const roles = {
        admin: { color: "bg-purple-100 text-purple-700 border-purple-200", label: "Admin", icon: Shield },
        manager: { color: "bg-indigo-100 text-indigo-700 border-indigo-200", label: "Manager", icon: Shield },
        committee: { color: "bg-blue-100 text-blue-700 border-blue-200", label: "Committee", icon: Users },
        owner: { color: "bg-emerald-100 text-emerald-700 border-emerald-200", label: "Owner", icon: Home },
        tenant: { color: "bg-amber-100 text-amber-700 border-amber-200", label: "Tenant", icon: User },
    };
    
    return roles[role as keyof typeof roles] || roles.owner;
}

function getInitials(name: string): string {
    return name
        .split(" ")
        .map(n => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

export default async function MembersPage() {
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
                <h1 className="text-2xl font-bold text-slate-900">Members Directory</h1>
                <Card className="border-amber-200 bg-amber-50">
                    <CardContent className="pt-6">
                        <p className="text-amber-900">You are not assigned to any building.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const members = await db.buildingMembership.findMany({
        where: { 
            buildingId: membership.buildingId,
            status: "active"
        },
        include: { 
            user: true,
            lot: true
        },
        orderBy: [
            { role: "asc" },
            { user: { name: "asc" } }
        ]
    });

    // Group members by role
    type MemberWithDetails = typeof members[0];
    const membersByRole = members.reduce((acc: Record<string, MemberWithDetails[]>, member: MemberWithDetails) => {
        if (!acc[member.role]) {
            acc[member.role] = [];
        }
        acc[member.role].push(member);
        return acc;
    }, {} as Record<string, MemberWithDetails[]>);

    const stats = {
        total: members.length,
        owners: members.filter((m: MemberWithDetails) => m.role === "owner").length,
        tenants: members.filter((m: MemberWithDetails) => m.role === "tenant").length,
        committee: members.filter((m: MemberWithDetails) => ["manager", "committee", "admin"].includes(m.role)).length,
    };

    // Check if user can manage (manager or admin)
    const canManage = ["manager", "admin"].includes(membership.role);

    return (
        <div className="flex flex-col gap-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Members Directory</h1>
                    <p className="text-slate-600 mt-1">{membership.building.name}</p>
                </div>
                {canManage && (
                    <Link href="/dashboard/members/invite">
                        <Button className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-md">
                            <Plus className="mr-2 h-4 w-4" /> Invite Member
                        </Button>
                    </Link>
                )}
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="border-l-4 border-l-indigo-500">
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
                        <p className="text-xs text-slate-600 mt-1">Total Members</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-emerald-500">
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-emerald-600">{stats.owners}</div>
                        <p className="text-xs text-slate-600 mt-1">Owners</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-amber-500">
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-amber-600">{stats.tenants}</div>
                        <p className="text-xs text-slate-600 mt-1">Tenants</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-blue-600">{stats.committee}</div>
                        <p className="text-xs text-slate-600 mt-1">Committee</p>
                    </CardContent>
                </Card>
            </div>

            {/* Members Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {members.map((member: MemberWithDetails) => {
                    const roleBadge = getRoleBadge(member.role);
                    const RoleIcon = roleBadge.icon;
                    
                    return (
                        <Card key={member.id} className="hover:shadow-lg transition-shadow">
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-4">
                                    {/* Avatar */}
                                    <Avatar className="h-14 w-14 border-2 border-indigo-100">
                                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-semibold text-lg">
                                            {getInitials(member.user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    
                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-slate-900 mb-1 truncate">
                                            {member.user.name}
                                        </h3>
                                        
                                        {/* Role Badge */}
                                        <Badge className={`${roleBadge.color} mb-3`}>
                                            <RoleIcon className="h-3 w-3 mr-1" />
                                            {roleBadge.label}
                                        </Badge>
                                        
                                        {/* Contact Info */}
                                        <div className="space-y-2 text-sm">
                                            {member.user.email && (
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <Mail className="h-4 w-4 text-slate-400 flex-shrink-0" />
                                                    <span className="truncate">{member.user.email}</span>
                                                </div>
                                            )}
                                            {member.user.phone && (
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <Phone className="h-4 w-4 text-slate-400 flex-shrink-0" />
                                                    <span>{member.user.phone}</span>
                                                </div>
                                            )}
                                            {member.lot && (
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <Building2 className="h-4 w-4 text-slate-400 flex-shrink-0" />
                                                    <span>Unit {member.lot.unitNumber}</span>
                                                    {member.lot.floor && <span className="text-slate-400">• Floor {member.lot.floor}</span>}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Australian Compliance Info */}
            <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                    <div className="flex gap-3">
                        <div className="text-2xl">🇦🇺</div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-blue-900 mb-1">Privacy & Strata Roll Requirements</h4>
                            <p className="text-sm text-blue-800">
                                Member information is maintained in accordance with NSW Strata Schemes Management Act 2015, 
                                Section 177 (Strata Roll). Contact details are protected under Australian Privacy Principles 
                                and only accessible to authorized building members.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
