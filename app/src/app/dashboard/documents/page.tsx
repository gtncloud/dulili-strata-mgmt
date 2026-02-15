import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Download, Calendar, User, AlertCircle, Shield, FileCheck, Folder } from "lucide-react";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";
import { format, formatDistanceToNow, isBefore } from "date-fns";

function getCategoryInfo(category: string) {
    const categories = {
        insurance: { icon: "🛡️", label: "Insurance", color: "bg-blue-100 text-blue-700 border-blue-200" },
        minutes: { icon: "📝", label: "Meeting Minutes", color: "bg-purple-100 text-purple-700 border-purple-200" },
        financial: { icon: "💰", label: "Financial", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
        compliance: { icon: "✅", label: "Compliance", color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
        bylaws: { icon: "⚖️", label: "By-Laws", color: "bg-amber-100 text-amber-700 border-amber-200" },
        other: { icon: "📄", label: "Other", color: "bg-slate-100 text-slate-700 border-slate-200" },
    };
    
    return categories[category as keyof typeof categories] || categories.other;
}

function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default async function DocumentsPage() {
    const session = await verifySession();

    if (!session?.isAuth) {
        redirect("/auth/login");
    }

    // Get user's building
    const membership = await db.buildingMembership.findFirst({
        where: { userId: session.userId, status: "active" },
    });

    if (!membership) {
        return (
            <div className="flex flex-col gap-6 p-6">
                <h1 className="text-2xl font-bold text-slate-900">Documents</h1>
                <Card className="border-amber-200 bg-amber-50">
                    <CardContent className="pt-6">
                        <p className="text-amber-900">You are not assigned to any building.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const documents = await db.document.findMany({
        where: { buildingId: membership.buildingId },
        orderBy: { createdAt: "desc" },
        include: { 
            uploader: { select: { id: true, name: true, role: true } }
        }
    });

    // Group documents by category
    type DocumentWithUploader = typeof documents[0];
    const documentsByCategory = documents.reduce((acc: Record<string, DocumentWithUploader[]>, doc: DocumentWithUploader) => {
        if (!acc[doc.category]) {
            acc[doc.category] = [];
        }
        acc[doc.category].push(doc);
        return acc;
    }, {} as Record<string, DocumentWithUploader[]>);

    const stats = {
        total: documents.length,
        expiringSoon: documents.filter((d: DocumentWithUploader) => {
            if (!d.expiresAt) return false;
            const thirtyDaysFromNow = new Date();
            thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
            return d.expiresAt <= thirtyDaysFromNow && d.expiresAt >= new Date();
        }).length,
        expired: documents.filter((d: DocumentWithUploader) => d.expiresAt && isBefore(d.expiresAt, new Date())).length,
    };

    // Check if user can upload (manager or committee)
    const canUpload = ["manager", "committee", "admin"].includes(membership.role);

    return (
        <div className="flex flex-col gap-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Documents</h1>
                    <p className="text-slate-600 mt-1">Building documents and records</p>
                </div>
                {canUpload && (
                    <Link href="/dashboard/documents/new">
                        <Button className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-md">
                            <Plus className="mr-2 h-4 w-4" /> Upload Document
                        </Button>
                    </Link>
                )}
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-l-4 border-l-indigo-500">
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
                        <p className="text-xs text-slate-600 mt-1">Total Documents</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-amber-500">
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-amber-600">{stats.expiringSoon}</div>
                        <p className="text-xs text-slate-600 mt-1">Expiring Soon (30 days)</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-rose-500">
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-rose-600">{stats.expired}</div>
                        <p className="text-xs text-slate-600 mt-1">Expired</p>
                    </CardContent>
                </Card>
            </div>

            {/* Documents by Category */}
            {documents.length === 0 ? (
                <Card className="border-dashed border-2">
                    <CardContent className="pt-12 pb-12 text-center">
                        <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <FileText className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">No documents yet</h3>
                        <p className="text-slate-600 mb-6">Upload important building documents for easy access</p>
                        {canUpload && (
                            <Link href="/dashboard/documents/new">
                                <Button className="bg-gradient-primary">
                                    <Plus className="mr-2 h-4 w-4" /> Upload First Document
                                </Button>
                            </Link>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {(Object.entries(documentsByCategory) as [string, DocumentWithUploader[]][]).map(([category, docs]) => {
                        const categoryInfo = getCategoryInfo(category);
                        return (
                            <Card key={category} className="shadow-sm">
                                <CardHeader className="bg-slate-50 border-b">
                                    <div className="flex items-center gap-3">
                                        <div className="text-2xl">{categoryInfo.icon}</div>
                                        <div className="flex-1">
                                            <CardTitle className="text-lg">{categoryInfo.label}</CardTitle>
                                            <p className="text-sm text-slate-600 mt-1">{docs.length} document{docs.length !== 1 ? 's' : ''}</p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <div className="grid gap-3">
                                        {docs.map((doc: DocumentWithUploader) => {
                                            const isExpired = doc.expiresAt && isBefore(doc.expiresAt, new Date());
                                            const isExpiringSoon = doc.expiresAt && !isExpired && (() => {
                                                const thirtyDaysFromNow = new Date();
                                                thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
                                                return doc.expiresAt <= thirtyDaysFromNow;
                                            })();

                                            return (
                                                <div 
                                                    key={doc.id}
                                                    className="flex items-start gap-4 p-4 rounded-lg border hover:shadow-md transition-shadow bg-white"
                                                >
                                                    <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                                                        <FileText className="h-6 w-6 text-amber-600" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div className="flex-1">
                                                                <h4 className="font-semibold text-slate-900 mb-1">{doc.name}</h4>
                                                                <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                                                                    <div className="flex items-center gap-1">
                                                                        <User className="h-4 w-4 text-slate-400" />
                                                                        <span>{doc.uploader.name}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1">
                                                                        <Calendar className="h-4 w-4 text-slate-400" />
                                                                        <span>{format(doc.createdAt, "MMM d, yyyy")}</span>
                                                                    </div>
                                                                    <span className="text-slate-400">•</span>
                                                                    <span>{formatFileSize(doc.fileSize)}</span>
                                                                    {doc.version > 1 && (
                                                                        <>
                                                                            <span className="text-slate-400">•</span>
                                                                            <span className="text-amber-600 font-medium">v{doc.version}</span>
                                                                        </>
                                                                    )}
                                                                </div>
                                                                {doc.expiresAt && (
                                                                    <div className="mt-2 flex items-center gap-2">
                                                                        {isExpired ? (
                                                                            <Badge className="bg-rose-100 text-rose-700 border-rose-200">
                                                                                <AlertCircle className="h-3 w-3 mr-1" />
                                                                                Expired {format(doc.expiresAt, "MMM d, yyyy")}
                                                                            </Badge>
                                                                        ) : isExpiringSoon ? (
                                                                            <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                                                                                <AlertCircle className="h-3 w-3 mr-1" />
                                                                                Expires {format(doc.expiresAt, "MMM d, yyyy")}
                                                                            </Badge>
                                                                        ) : (
                                                                            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                                                                                <FileCheck className="h-3 w-3 mr-1" />
                                                                                Valid until {format(doc.expiresAt, "MMM d, yyyy")}
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <Button size="sm" variant="outline" className="flex-shrink-0" asChild>
                                                                <a href={doc.url} download target="_blank" rel="noopener noreferrer">
                                                                    <Download className="h-4 w-4 mr-2" />
                                                                    Download
                                                                </a>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Australian Compliance Info */}
            <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                    <div className="flex gap-3">
                        <div className="text-2xl">🇦🇺</div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-blue-900 mb-1">Document Retention Requirements</h4>
                            <p className="text-sm text-blue-800">
                                All documents are stored in accordance with NSW Strata Schemes Management Act 2015. 
                                Financial records must be retained for 7 years, meeting minutes permanently, 
                                and insurance documents for the policy period plus 7 years.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
