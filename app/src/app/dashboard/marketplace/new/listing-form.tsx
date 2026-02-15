"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingBag, Gift, Repeat, Wrench, HelpCircle, Package } from "lucide-react";
import { createListing } from "./actions";

const categories = [
    {
        value: "sale",
        label: "For Sale",
        icon: ShoppingBag,
        description: "Sell items to neighbors",
        showPrice: true,
    },
    {
        value: "free",
        label: "Free Stuff",
        icon: Gift,
        description: "Give away items for free",
        showPrice: false,
    },
    {
        value: "trade",
        label: "Trade",
        icon: Repeat,
        description: "Swap items with neighbors",
        showPrice: false,
    },
    {
        value: "service",
        label: "Services",
        icon: Wrench,
        description: "Offer services (tutoring, dog walking, etc.)",
        showPrice: true,
    },
    {
        value: "wanted",
        label: "Wanted",
        icon: HelpCircle,
        description: "Looking for items or services",
        showPrice: true,
    },
    {
        value: "lending",
        label: "Lending Library",
        icon: Package,
        description: "Lend tools or equipment",
        showPrice: false,
    },
];

export function ListingForm({ buildingId, userId }: { buildingId: string; userId: string }) {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const selectedCategoryData = categories.find((c) => c.value === selectedCategory);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        formData.append("buildingId", buildingId);
        formData.append("userId", userId);

        const result = await createListing(formData);

        if (result.error) {
            setError(result.error);
            setLoading(false);
        } else {
            router.push("/dashboard/marketplace");
            router.refresh();
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Selection */}
            <Card className="p-6">
                <Label className="text-base font-medium mb-4 block">Category</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                            <button
                                key={category.value}
                                type="button"
                                onClick={() => setSelectedCategory(category.value)}
                                className={`p-4 border-2 rounded-lg text-left transition-all ${
                                    selectedCategory === category.value
                                        ? "border-amber-500 bg-amber-50"
                                        : "border-gray-200 hover:border-gray-300"
                                }`}
                            >
                                <Icon
                                    className={`h-6 w-6 mb-2 ${
                                        selectedCategory === category.value
                                            ? "text-amber-600"
                                            : "text-gray-400"
                                    }`}
                                />
                                <div className="font-medium text-sm text-gray-900">
                                    {category.label}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {category.description}
                                </div>
                            </button>
                        );
                    })}
                </div>
                <input type="hidden" name="category" value={selectedCategory} required />
            </Card>

            {selectedCategory && (
                <>
                    {/* Title and Description */}
                    <Card className="p-6 space-y-4">
                        <div>
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="e.g., IKEA Bookshelf - Excellent Condition"
                                required
                                maxLength={100}
                                className="mt-1.5"
                            />
                        </div>

                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Provide details about the item or service..."
                                required
                                rows={5}
                                maxLength={1000}
                                className="mt-1.5"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Be clear and detailed to help neighbors understand what you're offering
                            </p>
                        </div>
                    </Card>

                    {/* Price and Location */}
                    <Card className="p-6 space-y-4">
                        {selectedCategoryData?.showPrice && (
                            <div>
                                <Label htmlFor="price">
                                    Price {selectedCategory === "wanted" ? "(Optional)" : ""}
                                </Label>
                                <div className="relative mt-1.5">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                        $
                                    </span>
                                    <Input
                                        id="price"
                                        name="price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="0.00"
                                        className="pl-7"
                                        required={
                                            selectedCategory === "sale" ||
                                            selectedCategory === "service"
                                        }
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <Label htmlFor="location">Location (Optional)</Label>
                            <Input
                                id="location"
                                name="location"
                                placeholder="e.g., Unit 402 or Common Area"
                                maxLength={50}
                                className="mt-1.5"
                            />
                        </div>

                        <div>
                            <Label htmlFor="contactInfo">Contact Info (Optional)</Label>
                            <Input
                                id="contactInfo"
                                name="contactInfo"
                                placeholder="e.g., Phone number or preferred contact method"
                                maxLength={100}
                                className="mt-1.5"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Leave blank to be contacted through the platform
                            </p>
                        </div>
                    </Card>

                    {/* Error Message */}
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                            {error}
                        </div>
                    )}

                    {/* Submit Buttons */}
                    <div className="flex gap-3 justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-amber-600 hover:bg-amber-700"
                        >
                            {loading ? "Creating..." : "Create Listing"}
                        </Button>
                    </div>
                </>
            )}

            {!selectedCategory && (
                <p className="text-center text-sm text-gray-500 py-8">
                    Select a category to continue
                </p>
            )}
        </form>
    );
}
