"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { logout } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { DuliliIcon } from "@/components/dulili-logo";
import {
    LayoutDashboard,
    Building,
    Wrench,
    Megaphone,
    FileText,
    DollarSign,
    LogOut,
    Users,
    Calendar,
    TrendingUp,
    FolderOpen,
    Sparkles,
    MessageCircle,
    BarChart3,
    ShoppingBag,
    Store,
    Heart,
    Leaf,
    AlertTriangle,
    Brain,
    Wifi
} from "lucide-react";

export function Sidebar({ userRole }: { userRole: string }) {
    const pathname = usePathname();

    // Show Work Orders for maintenance staff
    const showWorkOrders = ["maintenance_staff", "manager", "admin"].includes(userRole);

    const managementLinks = [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        ...(showWorkOrders ? [{ href: "/dashboard/work-orders", label: "Work Orders", icon: Wrench }] : []),
        { href: "/dashboard/maintenance", label: "Maintenance Requests", icon: Wrench },
        { href: "/dashboard/announcements", label: "Announcements", icon: Megaphone },
        { href: "/dashboard/community", label: "Community Chat", icon: MessageCircle },
        { href: "/dashboard/marketplace", label: "Marketplace", icon: ShoppingBag },
        { href: "/dashboard/local-businesses", label: "Local Businesses", icon: Store },
        { href: "/dashboard/neighbors", label: "Neighbors", icon: Heart },
        { href: "/dashboard/amenities", label: "Amenities Booking", icon: Sparkles },
        { href: "/dashboard/surveys", label: "Surveys & Polls", icon: BarChart3 },
        { href: "/dashboard/sustainability", label: "Sustainability", icon: Leaf },
        { href: "/dashboard/meetings", label: "Meeting Scheduler", icon: Calendar },
        { href: "/dashboard/members", label: "Member Directory", icon: Users },
    ];

    const smartBuildingLinks = [
        { href: "/dashboard/emergency", label: "Emergency Response", icon: AlertTriangle },
        { href: "/dashboard/predictive-maintenance", label: "Predictive Maintenance", icon: Brain },
        { href: "/dashboard/iot", label: "IoT Dashboard", icon: Wifi },
    ];

    const financeLinks = [
        { href: "/dashboard/finance", label: "Levy Management", icon: DollarSign },
        { href: "/dashboard/documents", label: "Document Library", icon: FolderOpen },
        { href: "/dashboard/building", label: "Building Profile", icon: Building },
    ];

    return (
        <div className="flex h-full flex-col bg-gray-50 border-r border-gray-200">
            {/* Logo */}
            <div className="flex h-14 items-center px-4 border-b border-gray-200 bg-white">
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-6 h-6 text-amber-500">
                        <DuliliIcon className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">Dulili</span>
                </Link>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-auto py-4 px-3">
                {/* Management & Community Section */}
                <div className="mb-6">
                    <h3 className="px-2 mb-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                        Management & Community
                    </h3>
                    <nav className="space-y-0.5">
                        {managementLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "flex items-center gap-2 px-2 py-1.5 rounded text-[13px] transition-colors",
                                        isActive
                                            ? "bg-gray-200 text-gray-900 font-medium"
                                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                    )}
                                >
                                    <Icon className={cn(
                                        "h-4 w-4 flex-shrink-0",
                                        isActive ? "text-gray-700" : "text-gray-400"
                                    )} />
                                    <span className="truncate">{link.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Smart Building Section */}
                <div className="mb-6">
                    <h3 className="px-2 mb-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                        Smart Building
                    </h3>
                    <nav className="space-y-0.5">
                        {smartBuildingLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "flex items-center gap-2 px-2 py-1.5 rounded text-[13px] transition-colors",
                                        isActive
                                            ? "bg-gray-200 text-gray-900 font-medium"
                                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                    )}
                                >
                                    <Icon className={cn(
                                        "h-4 w-4 flex-shrink-0",
                                        isActive ? "text-gray-700" : "text-gray-400"
                                    )} />
                                    <span className="truncate">{link.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Finance & Documents Section */}
                <div>
                    <h3 className="px-2 mb-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                        Finance & Documents
                    </h3>
                    <nav className="space-y-0.5">
                        {financeLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "flex items-center gap-2 px-2 py-1.5 rounded text-[13px] transition-colors",
                                        isActive
                                            ? "bg-gray-200 text-gray-900 font-medium"
                                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                    )}
                                >
                                    <Icon className={cn(
                                        "h-4 w-4 flex-shrink-0",
                                        isActive ? "text-gray-700" : "text-gray-400"
                                    )} />
                                    <span className="truncate">{link.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* User Profile */}
            <div className="mt-auto p-3 border-t border-gray-200 bg-white">
                <Link href="/dashboard/profile">
                    <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 transition-colors mb-1.5">
                        <div className="h-7 w-7 rounded-full bg-gray-200 flex items-center justify-center text-[11px] font-semibold text-gray-600">
                            ME
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-[13px] font-medium text-gray-900 truncate">User Profile</p>
                            <p className="text-[11px] text-gray-500 truncate capitalize">{userRole}</p>
                        </div>
                    </div>
                </Link>
                <form action={logout}>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-start gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 h-8 text-[13px]"
                    >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Sign Out</span>
                    </Button>
                </form>
            </div>
        </div>
    );
}
