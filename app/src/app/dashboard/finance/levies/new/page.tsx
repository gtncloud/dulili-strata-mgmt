"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Calendar, DollarSign, Home } from "lucide-react";
import Link from "next/link";

export default function NewLevyPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [selectedLots, setSelectedLots] = useState<string[]>([]);

    // Mock lots data - in real app, fetch from database
    const lots = [
        { id: "1", unitNumber: "101", floor: 1, entitlement: 1.0 },
        { id: "2", unitNumber: "102", floor: 1, entitlement: 1.0 },
        { id: "3", unitNumber: "201", floor: 2, entitlement: 1.2 },
        { id: "4", unitNumber: "202", floor: 2, entitlement: 1.2 },
        { id: "5", unitNumber: "301", floor: 3, entitlement: 1.5 },
    ];

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        
        // TODO: Implement server action to create levies
        console.log('Levy data:', {
            period: formData.get('period'),
            amount: formData.get('amount'),
            dueDate: formData.get('dueDate'),
            lots: selectedLots,
        });

        // Simulate save
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        router.push('/dashboard/finance/levies');
    };

    const toggleLot = (lotId: string) => {
        setSelectedLots(prev =>
            prev.includes(lotId)
                ? prev.filter(id => id !== lotId)
                : [...prev, lotId]
        );
    };

    const selectAll = () => {
        setSelectedLots(lots.map(lot => lot.id));
    };

    const deselectAll = () => {
        setSelectedLots([]);
    };

    return (
        <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/finance/levies">
                    <Button variant="ghost" size="sm" className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Create Levy</h1>
                    <p className="text-slate-600 mt-1">Issue levies to lot owners</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
                <Card className="shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-emerald-50 to-blue-50 border-b">
                        <CardTitle>Levy Details</CardTitle>
                        <CardDescription>
                            Set the levy period, amount, and due date
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        {/* Period */}
                        <div className="space-y-2">
                            <Label htmlFor="period" className="text-slate-700 font-medium">
                                Period <span className="text-rose-500">*</span>
                            </Label>
                            <Input
                                id="period"
                                name="period"
                                placeholder="e.g., Q1 2026, March 2026"
                                required
                                className="h-11"
                            />
                            <p className="text-xs text-slate-500">
                                Billing period for this levy
                            </p>
                        </div>

                        {/* Amount */}
                        <div className="space-y-2">
                            <Label htmlFor="amount" className="text-slate-700 font-medium">
                                Amount per Unit Entitlement <span className="text-rose-500">*</span>
                            </Label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input
                                    id="amount"
                                    name="amount"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    required
                                    className="h-11 pl-10"
                                />
                            </div>
                            <p className="text-xs text-slate-500">
                                Base amount multiplied by unit entitlement
                            </p>
                        </div>

                        {/* Due Date */}
                        <div className="space-y-2">
                            <Label htmlFor="dueDate" className="text-slate-700 font-medium">
                                Due Date <span className="text-rose-500">*</span>
                            </Label>
                            <div className="relative">
                                <Input
                                    id="dueDate"
                                    name="dueDate"
                                    type="date"
                                    required
                                    className="h-11"
                                />
                                <Calendar className="absolute right-3 top-3 h-5 w-5 text-slate-400 pointer-events-none" />
                            </div>
                            <p className="text-xs text-slate-500">
                                Payment deadline for this levy
                            </p>
                        </div>

                        {/* Lot Selection */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="text-slate-700 font-medium">
                                    Select Lots <span className="text-rose-500">*</span>
                                </Label>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={selectAll}
                                    >
                                        Select All
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={deselectAll}
                                    >
                                        Deselect All
                                    </Button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {lots.map((lot) => (
                                    <label
                                        key={lot.id}
                                        className={`
                                            relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all
                                            ${selectedLots.includes(lot.id)
                                                ? "border-emerald-500 bg-emerald-50 shadow-md"
                                                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                            }
                                        `}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedLots.includes(lot.id)}
                                            onChange={() => toggleLot(lot.id)}
                                            className="sr-only"
                                        />
                                        <Home className="h-5 w-5 mr-3 text-slate-600" />
                                        <div className="flex-1">
                                            <div className="text-sm font-medium text-slate-900">
                                                Unit {lot.unitNumber}
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                Floor {lot.floor} • {lot.entitlement}x
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                            <p className="text-xs text-slate-500">
                                {selectedLots.length} lot{selectedLots.length !== 1 ? 's' : ''} selected
                            </p>
                        </div>

                        {/* Preview */}
                        {selectedLots.length > 0 && (
                            <div className="bg-amber-50 border border-indigo-200 rounded-lg p-4">
                                <h4 className="font-semibold text-indigo-900 mb-3">Levy Preview</h4>
                                <div className="space-y-2">
                                    {lots
                                        .filter(lot => selectedLots.includes(lot.id))
                                        .map(lot => {
                                            const baseAmount = parseFloat((document.getElementById('amount') as HTMLInputElement)?.value || '0');
                                            const totalAmount = baseAmount * lot.entitlement;
                                            return (
                                                <div key={lot.id} className="flex justify-between text-sm">
                                                    <span className="text-indigo-800">Unit {lot.unitNumber}</span>
                                                    <span className="font-medium text-indigo-900">
                                                        ${totalAmount.toFixed(2)} ({lot.entitlement}x)
                                                    </span>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        )}

                        {/* Australian Compliance Note */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex gap-3">
                                <div className="text-2xl">🇦🇺</div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-blue-900 mb-1">Levy Compliance</h4>
                                    <p className="text-sm text-blue-800 mb-2">
                                        Levies are issued in accordance with NSW Strata Schemes Management Act 2015:
                                    </p>
                                    <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                                        <li>Section 76: Contributions to administrative and capital works funds</li>
                                        <li>Section 77: Determination of contributions by owners corporation</li>
                                        <li>Section 85: Recovery of unpaid contributions</li>
                                        <li>Section 86: Interest on unpaid contributions (max 10% p.a.)</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                    <Link href="/dashboard/finance/levies" className="flex-1">
                        <Button type="button" variant="outline" className="w-full h-11" disabled={loading}>
                            Cancel
                        </Button>
                    </Link>
                    <Button
                        type="submit"
                        className="flex-1 h-11 bg-gradient-primary hover:opacity-90 transition-opacity"
                        disabled={loading || selectedLots.length === 0}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            "Create Levies"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
