"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createChannel } from "../[id]/actions";
import { Hash, MessageSquare, Users, Lock } from "lucide-react";

interface NewChannelFormProps {
    buildingId: string;
    userId: string;
}

export default function NewChannelForm({ buildingId, userId }: NewChannelFormProps) {
    const router = useRouter();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("general");
    const [isPrivate, setIsPrivate] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const channelTypes = [
        { value: "general", label: "General", icon: Hash, description: "General discussions" },
        { value: "maintenance", label: "Maintenance", icon: MessageSquare, description: "Building maintenance topics" },
        { value: "social", label: "Social", icon: Users, description: "Social events and gatherings" },
        { value: "committee", label: "Committee", icon: Lock, description: "Committee discussions" },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            const result = await createChannel(
                buildingId,
                name,
                description,
                type,
                isPrivate,
                userId
            );

            if (result.success && result.channelId) {
                router.push(`/dashboard/community/${result.channelId}`);
            } else {
                setError(result.error || "Failed to create channel");
            }
        } catch (err) {
            setError("An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Channel Name
                </label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    maxLength={50}
                    placeholder="e.g., Pool Maintenance Discussion"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (optional)
                </label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    maxLength={200}
                    placeholder="What is this channel about?"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Channel Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                    {channelTypes.map((channelType) => {
                        const Icon = channelType.icon;
                        return (
                            <button
                                key={channelType.value}
                                type="button"
                                onClick={() => setType(channelType.value)}
                                className={`p-4 border-2 rounded-lg text-left transition-all ${
                                    type === channelType.value
                                        ? "border-amber-500 bg-amber-50"
                                        : "border-gray-200 hover:border-gray-300"
                                }`}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <Icon className="h-4 w-4 text-gray-600" />
                                    <span className="text-sm font-medium text-gray-900">
                                        {channelType.label}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-600">{channelType.description}</p>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div>
                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={isPrivate}
                        onChange={(e) => setIsPrivate(e.target.checked)}
                        className="w-4 h-4 text-amber-500 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <div>
                        <span className="text-sm font-medium text-gray-900">Private Channel</span>
                        <p className="text-xs text-gray-600">
                            Only invited members can see and join this channel
                        </p>
                    </div>
                </label>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                    {error}
                </div>
            )}

            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting || !name.trim()}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isSubmitting ? "Creating..." : "Create Channel"}
                </button>
            </div>
        </form>
    );
}
