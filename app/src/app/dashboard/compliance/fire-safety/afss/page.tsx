import { verifySession } from "@/lib/session";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, CheckCircle2, AlertTriangle, Calendar, Download, Upload } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function AFSSPage() {
    const session = await verifySession();
    if (!session) redirect("/auth/login");

    const membership = await db.buildingMembership.findFirst({
        where: {
            userId: session.userId,
            status: "active",
        },
        include: {
            building: true,
        },
    });

    if (!membership) {
        return <div>No building membership found</div>;
    }

    // Fetch AFSS statements
    const statements = await db.annualFireSafetyStatement.findMany({
        where: { buildingId: membership.buildingId },
        orderBy: { year: "desc" },
    });

    const currentYear = new Date().getFullYear();
    const currentStatement = statements.find(s => s.year === currentYear);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/compliance/fire-safety">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Annual Fire Safety Statements (AFSS)
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Manage AFSS submissions to Council and Fire & Rescue NSW
                    </p>
                </div>
            </div>

            {/* Information Card */}
            <Card className="border-blue-200 bg-blue-50">
                <CardContent className="pt-6">
                    <div className="flex gap-3">
                        <FileText className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-900">
                            <p className="font-medium mb-2">About AFSS</p>
                            <p className="mb-2">
                                Under NSW Environmental Planning and Assessment Regulation, building owners must 
                                submit an Annual Fire Safety Statement (AFSS) each year to:
                            </p>
                            <ul className="list-disc list-inside space-y-1 ml-2">
                                <li>Local Council</li>
                                <li>Fire and Rescue NSW</li>
                                <li>Display prominently in the building</li>
                            </ul>
                            <p className="mt-2">
                                The AFSS must be endorsed by an Accredited Practitioner (Fire Safety) and certify 
                                that all fire safety measures have been tested and maintained to AS1851-2012 standards.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Current Year Status */}
            {currentStatement ? (
                <Card className={
                    currentStatement.status === "submitted" ? "border-green-200 bg-green-50" :
                    currentStatement.status === "overdue" ? "border-red-200 bg-red-50" :
                    "border-amber-200 bg-amber-50"
                }>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    {currentStatement.status === "submitted" ? (
                                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                                    ) : (
                                        <AlertTriangle className="h-5 w-5 text-amber-600" />
                                    )}
                                    AFSS {currentYear}
                                </CardTitle>
                                <CardDescription>
                                    Due: {new Date(currentStatement.dueDate).toLocaleDateString()}
                                </CardDescription>
                            </div>
                            <Badge variant={
                                currentStatement.status === "submitted" ? "default" :
                                currentStatement.status === "overdue" ? "destructive" :
                                "secondary"
                            }>
                                {currentStatement.status}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-medium text-gray-900 mb-3">Practitioner Details</h4>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <p className="text-gray-600">Name</p>
                                        <p className="font-medium">
                                            {currentStatement.practitionerName || "Not assigned"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Accreditation Number</p>
                                        <p className="font-medium">
                                            {currentStatement.practitionerNumber || "N/A"}
                                        </p>
                                    </div>
                                    {currentStatement.issueDate && (
                                        <div>
                                            <p className="text-gray-600">Issue Date</p>
                                            <p className="font-medium">
                                                {new Date(currentStatement.issueDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium text-gray-900 mb-3">Submission Status</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm">Council Submission</span>
                                        </div>
                                        {currentStatement.submittedToCouncil ? (
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                <span className="text-sm text-green-600">
                                                    {currentStatement.councilSubmissionDate 
                                                        ? new Date(currentStatement.councilSubmissionDate).toLocaleDateString()
                                                        : "Submitted"}
                                                </span>
                                            </div>
                                        ) : (
                                            <Badge variant="secondary">Pending</Badge>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm">Fire & Rescue NSW</span>
                                        </div>
                                        {currentStatement.submittedToFireRescue ? (
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                <span className="text-sm text-green-600">
                                                    {currentStatement.fireRescueSubmissionDate 
                                                        ? new Date(currentStatement.fireRescueSubmissionDate).toLocaleDateString()
                                                        : "Submitted"}
                                                </span>
                                            </div>
                                        ) : (
                                            <Badge variant="secondary">Pending</Badge>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm">Building Display</span>
                                        </div>
                                        {currentStatement.displayedInBuilding ? (
                                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                                        ) : (
                                            <Badge variant="secondary">Not Displayed</Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {currentStatement.certificateUrl && (
                            <div className="mt-4 pt-4 border-t">
                                <Button variant="outline" size="sm" asChild>
                                    <a href={currentStatement.certificateUrl} target="_blank" rel="noopener noreferrer">
                                        <Download className="h-4 w-4 mr-2" />
                                        Download Certificate
                                    </a>
                                </Button>
                            </div>
                        )}

                        {currentStatement.notes && (
                            <div className="mt-4 pt-4 border-t">
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">Notes:</span> {currentStatement.notes}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <Card className="border-red-200 bg-red-50">
                    <CardHeader>
                        <CardTitle className="text-red-900 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" />
                            No AFSS for {currentYear}
                        </CardTitle>
                        <CardDescription className="text-red-700">
                            You need to create an AFSS for the current year
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-red-800 mb-4">
                            An Annual Fire Safety Statement must be submitted each year. Contact your 
                            Accredited Practitioner (Fire Safety) to arrange an inspection and create 
                            the {currentYear} AFSS.
                        </p>
                        <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
                            <Upload className="h-4 w-4 mr-2" />
                            Create {currentYear} AFSS
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Historical Statements */}
            <Card>
                <CardHeader>
                    <CardTitle>Historical AFSS Records</CardTitle>
                    <CardDescription>
                        Previous Annual Fire Safety Statements
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {statements.length === 0 ? (
                        <p className="text-center text-gray-600 py-8">
                            No AFSS records found
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {statements.map((statement) => (
                                <div key={statement.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3 flex-1">
                                            <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <p className="font-medium text-gray-900">AFSS {statement.year}</p>
                                                    <Badge variant={
                                                        statement.status === "submitted" ? "default" :
                                                        statement.status === "overdue" ? "destructive" :
                                                        "secondary"
                                                    }>
                                                        {statement.status}
                                                    </Badge>
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm">
                                                    <div>
                                                        <p className="text-gray-500">Due Date</p>
                                                        <p className="font-medium">
                                                            {new Date(statement.dueDate).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    {statement.practitionerName && (
                                                        <div>
                                                            <p className="text-gray-500">Practitioner</p>
                                                            <p className="font-medium">{statement.practitionerName}</p>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="text-gray-500">Council</p>
                                                        <p className="font-medium">
                                                            {statement.submittedToCouncil ? (
                                                                <span className="text-green-600">✓ Submitted</span>
                                                            ) : (
                                                                <span className="text-gray-400">Pending</span>
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500">Fire & Rescue</p>
                                                        <p className="font-medium">
                                                            {statement.submittedToFireRescue ? (
                                                                <span className="text-green-600">✓ Submitted</span>
                                                            ) : (
                                                                <span className="text-gray-400">Pending</span>
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                                {statement.certificateUrl && (
                                                    <div className="mt-3">
                                                        <Button variant="outline" size="sm" asChild>
                                                            <a href={statement.certificateUrl} target="_blank" rel="noopener noreferrer">
                                                                <Download className="h-3 w-3 mr-2" />
                                                                Download
                                                            </a>
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Submission Checklist */}
            <Card>
                <CardHeader>
                    <CardTitle>AFSS Submission Checklist</CardTitle>
                    <CardDescription>
                        Steps to complete your Annual Fire Safety Statement
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
                                1
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Engage Accredited Practitioner</p>
                                <p className="text-sm text-gray-600 mt-1">
                                    Contact an Accredited Practitioner (Fire Safety) to conduct inspections
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
                                2
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Complete Inspections</p>
                                <p className="text-sm text-gray-600 mt-1">
                                    All fire safety measures must be tested and certified compliant
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
                                3
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Obtain AFSS Certificate</p>
                                <p className="text-sm text-gray-600 mt-1">
                                    Practitioner issues signed AFSS certificate
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
                                4
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Submit to Authorities</p>
                                <p className="text-sm text-gray-600 mt-1">
                                    Send copy to Local Council and Fire & Rescue NSW
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
                                5
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Display in Building</p>
                                <p className="text-sm text-gray-600 mt-1">
                                    Display AFSS in a prominent location within the building
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
