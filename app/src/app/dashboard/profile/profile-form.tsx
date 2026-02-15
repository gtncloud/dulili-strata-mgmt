"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProfileFormProps {
    user: {
        id: string;
        name: string;
        email: string;
        phone: string | null;
        role: string;
    };
}

export function ProfileForm({ user }: ProfileFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name") as string,
            phone: formData.get("phone") as string,
        };

        try {
            const response = await fetch("/api/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Failed to update profile");
            }

            setSuccess(true);
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update profile");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                    id="name"
                    name="name"
                    defaultValue={user.name}
                    required
                    disabled={loading}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={user.email}
                    disabled
                    className="bg-slate-50"
                />
                <p className="text-xs text-slate-500">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    defaultValue={user.phone || ""}
                    placeholder="+61 4XX XXX XXX"
                    disabled={loading}
                />
            </div>

            <div className="space-y-2">
                <Label>Role</Label>
                <Input
                    value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    disabled
                    className="bg-slate-50 capitalize"
                />
            </div>

            {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-700">
                    {error}
                </div>
            )}

            {success && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700">
                    Profile updated successfully!
                </div>
            )}

            <Button type="submit" disabled={loading} className="w-full">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
            </Button>
        </form>
    );
}
