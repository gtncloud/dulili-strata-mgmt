"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/ui/file-upload";
import { ArrowLeft, Loader2, Calendar, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { generateFilePath } from "@/lib/storage";
import { createDocument } from "./actions";

export default function NewDocumentPage() {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState("other");
    const [uploadedFile, setUploadedFile] = useState<{ 
        url: string; 
        path: string;
        name: string; 
        size: number;
        mimeType: string;
    } | null>(null);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const categories = [
        { value: "insurance", label: "Insurance", icon: "🛡️", description: "Policies & certificates" },
        { value: "minutes", label: "Meeting Minutes", icon: "📝", description: "AGM, EGM, Committee" },
        { value: "financial", label: "Financial", icon: "💰", description: "Reports & statements" },
        { value: "compliance", label: "Compliance", icon: "✅", description: "Certificates & audits" },
        { value: "bylaws", label: "By-Laws", icon: "⚖️", description: "Rules & regulations" },
        { value: "other", label: "Other", icon: "📄", description: "General documents" },
    ];

    const handleFileUpload = async (file: File) => {
        setUploading(true);
        setError(null);
        
        try {
            // Generate file path (buildingId will be added by server)
            const filePath = generateFilePath('temp', selectedCategory, file.name);
            
            // Create form data
            const formData = new FormData();
            formData.append('file', file);
            formData.append('filePath', filePath);
            
            // Upload via API route (bypasses RLS)
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Upload failed');
            }

            const result = await response.json();
            
            setUploadedFile({
                url: result.url,
                path: result.path,
                name: file.name,
                size: file.size,
                mimeType: file.type,
            });
        } catch (error) {
            console.error('Upload error:', error);
            setError(error instanceof Error ? error.message : 'Failed to upload file');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!uploadedFile) {
            setError('Please upload a file');
            return;
        }

        setSaving(true);
        setError(null);

        try {
            const formData = new FormData(e.currentTarget);
            
            console.log('Submitting document:', {
                name: formData.get('name'),
                category: formData.get('category'),
                expiryDate: formData.get('expiryDate'),
                uploadedFile
            });

            const result = await createDocument({
                name: formData.get('name') as string,
                category: formData.get('category') as string,
                expiryDate: formData.get('expiryDate') as string || undefined,
                fileUrl: uploadedFile.url,
                fileName: uploadedFile.name,
                fileSize: uploadedFile.size,
                mimeType: uploadedFile.mimeType,
            });

            console.log('Create document result:', result);

            if (!result.success) {
                throw new Error(result.error || 'Failed to save document');
            }

            console.log('Document saved successfully, redirecting...');
            router.push('/dashboard/documents');
            router.refresh();
        } catch (error) {
            console.error('Save error:', error);
            setError(error instanceof Error ? error.message : 'Failed to save document');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/documents">
                    <Button variant="ghost" size="sm" className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Upload Document</h1>
                    <p className="text-slate-600 mt-1">Add a new document to your building library</p>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <Card className="bg-rose-50 border-rose-200">
                    <CardContent className="pt-6">
                        <div className="flex gap-3">
                            <div className="text-2xl">⚠️</div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-rose-900 mb-1">Upload Error</h4>
                                <p className="text-sm text-rose-800">{error}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
                <Card className="shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b">
                        <CardTitle>Document Details</CardTitle>
                        <CardDescription>
                            Upload and categorize your building documents
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        {/* File Upload */}
                        <div className="space-y-2">
                            <Label className="text-slate-700 font-medium">
                                File <span className="text-rose-500">*</span>
                            </Label>
                            <FileUpload
                                onUpload={handleFileUpload}
                                disabled={uploading || saving}
                            />
                            {uploadedFile && (
                                <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 p-3 rounded-lg">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span>File uploaded: {uploadedFile.name}</span>
                                </div>
                            )}
                            <p className="text-xs text-slate-500">
                                Supported formats: PDF, Word, Excel, Images (max 10MB)
                            </p>
                        </div>

                        {/* Document Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-slate-700 font-medium">
                                Document Name <span className="text-rose-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="e.g., Building Insurance Policy 2026"
                                required
                                className="h-11"
                                disabled={saving}
                            />
                            <p className="text-xs text-slate-500">
                                Descriptive name for easy identification
                            </p>
                        </div>

                        {/* Category */}
                        <div className="space-y-3">
                            <Label className="text-slate-700 font-medium">
                                Category <span className="text-rose-500">*</span>
                            </Label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {categories.map((category) => (
                                    <label
                                        key={category.value}
                                        className={`
                                            relative flex flex-col items-start p-4 rounded-lg border-2 cursor-pointer transition-all
                                            ${selectedCategory === category.value
                                                ? "border-amber-500 bg-amber-50 shadow-md"
                                                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                            }
                                            ${saving ? "opacity-50 cursor-not-allowed" : ""}
                                        `}
                                    >
                                        <input
                                            type="radio"
                                            name="category"
                                            value={category.value}
                                            checked={selectedCategory === category.value}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                            className="sr-only"
                                            required
                                            disabled={saving}
                                        />
                                        <span className="text-2xl mb-2">{category.icon}</span>
                                        <span className="text-sm font-medium text-slate-900">{category.label}</span>
                                        <span className="text-xs text-slate-500 mt-1">{category.description}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Expiry Date (Optional) */}
                        <div className="space-y-2">
                            <Label htmlFor="expiryDate" className="text-slate-700 font-medium">
                                Expiry Date (Optional)
                            </Label>
                            <div className="relative">
                                <Input
                                    id="expiryDate"
                                    name="expiryDate"
                                    type="date"
                                    className="h-11"
                                    disabled={saving}
                                />
                                <Calendar className="absolute right-3 top-3 h-5 w-5 text-slate-400 pointer-events-none" />
                            </div>
                            <p className="text-xs text-slate-500">
                                Set expiry date for insurance policies, certificates, etc.
                            </p>
                        </div>

                        {/* Australian Compliance Note */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex gap-3">
                                <div className="text-2xl">📋</div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-blue-900 mb-1">Document Retention Requirements</h4>
                                    <p className="text-sm text-blue-800">
                                        Documents are stored in accordance with NSW Strata Schemes Management Act 2015. 
                                        Financial records must be retained for 7 years, meeting minutes permanently, 
                                        and insurance documents for the policy period plus 7 years.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                    <Link href="/dashboard/documents" className="flex-1">
                        <Button 
                            type="button" 
                            variant="outline" 
                            className="w-full h-11"
                            disabled={saving}
                        >
                            Cancel
                        </Button>
                    </Link>
                    <Button
                        type="submit"
                        className="flex-1 h-11 bg-gradient-primary hover:opacity-90 transition-opacity"
                        disabled={!uploadedFile || uploading || saving}
                    >
                        {saving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : uploading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            "Save Document"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
