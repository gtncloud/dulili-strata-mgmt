"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, X, Trash2 } from "lucide-react";
import { markAsSold, markAsClosed, deleteListing } from "./actions";

export function ListingActions({ listingId, status }: { listingId: string; status: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleMarkAsSold() {
        if (!confirm("Mark this listing as sold?")) return;
        setLoading(true);
        await markAsSold(listingId);
        router.refresh();
        setLoading(false);
    }

    async function handleMarkAsClosed() {
        if (!confirm("Close this listing?")) return;
        setLoading(true);
        await markAsClosed(listingId);
        router.refresh();
        setLoading(false);
    }

    async function handleDelete() {
        if (!confirm("Delete this listing? This action cannot be undone.")) return;
        setLoading(true);
        await deleteListing(listingId);
        router.push("/dashboard/marketplace");
        router.refresh();
    }

    return (
        <div className="flex gap-3">
            {status === "active" && (
                <>
                    <Button
                        onClick={handleMarkAsSold}
                        disabled={loading}
                        variant="outline"
                        size="sm"
                        className="text-green-600 border-green-600 hover:bg-green-50"
                    >
                        <Check className="h-4 w-4 mr-1.5" />
                        Mark as Sold
                    </Button>
                    <Button
                        onClick={handleMarkAsClosed}
                        disabled={loading}
                        variant="outline"
                        size="sm"
                    >
                        <X className="h-4 w-4 mr-1.5" />
                        Close Listing
                    </Button>
                </>
            )}
            <Button
                onClick={handleDelete}
                disabled={loading}
                variant="outline"
                size="sm"
                className="text-red-600 border-red-600 hover:bg-red-50"
            >
                <Trash2 className="h-4 w-4 mr-1.5" />
                Delete
            </Button>
        </div>
    );
}
