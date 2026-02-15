import { redirect } from "next/navigation";
import { verifySession } from "@/lib/session";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileForm } from "./profile-form";
import { PasswordForm } from "./password-form";

export default async function ProfilePage() {
    const session = await verifySession();
    if (!session?.isAuth) redirect("/auth/login");

    const user = await db.user.findUnique({
        where: { id: session.userId },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
        },
    });

    if (!user) redirect("/auth/login");

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Profile Settings</h1>
                <p className="text-sm text-slate-600 mt-1">Manage your account information</p>
            </div>

            <div className="grid gap-6">
                {/* Profile Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ProfileForm user={user} />
                    </CardContent>
                </Card>

                {/* Password Change */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Change Password</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <PasswordForm />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
