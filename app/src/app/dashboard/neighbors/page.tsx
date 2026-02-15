import { redirect } from "next/navigation";
import { verifySession } from "@/lib/session";
import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Heart, Users } from "lucide-react";

export default async function NeighborsPage() {
    const session = await verifySession();
    if (!session?.isAuth) redirect("/auth/login");

    const membership = await db.buildingMembership.findFirst({
        where: { userId: session.userId, status: "active" },
    });

    if (!membership) redirect("/dashboard");

    const profiles = await db.neighborProfile.findMany({
        where: {
            user: {
                memberships: {
                    some: {
                        buildingId: membership.buildingId,
                        status: "active",
                    },
                },
            },
            visibility: { in: ["building", "floor"] },
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });

    const myProfile = profiles.find(p => p.userId === session.userId);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Neighbor Connections</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Connect with neighbors who share your interests
                    </p>
                </div>
                <Link href="/dashboard/neighbors/my-profile">
                    <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                        {myProfile ? "Edit Profile" : "Create Profile"}
                    </Button>
                </Link>
            </div>

            {!myProfile && (
                <Card className="p-6 bg-amber-50 border-amber-200">
                    <div className="flex items-start gap-4">
                        <Heart className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-medium text-gray-900 mb-1">Create your profile to connect!</h3>
                            <p className="text-sm text-gray-600 mb-3">
                                Share your interests and what you're looking for to find like-minded neighbors.
                            </p>
                            <Link href="/dashboard/neighbors/my-profile">
                                <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                                    Create Profile
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Card>
            )}

            {profiles.length === 0 ? (
                <Card className="p-12 text-center">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No neighbor profiles yet</h3>
                    <p className="text-sm text-gray-600">
                        Be the first to create a profile and start building connections!
                    </p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {profiles.map((profile) => (
                        <Card key={profile.id} className="p-5">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                                    <User className="h-6 w-6 text-amber-600" />
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900">{profile.user.name}</div>
                                    {profile.userId === session.userId && (
                                        <Badge className="bg-amber-100 text-amber-800 text-xs">You</Badge>
                                    )}
                                </div>
                            </div>

                            {profile.bio && (
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{profile.bio}</p>
                            )}

                            {profile.interests.length > 0 && (
                                <div className="mb-3">
                                    <div className="text-xs text-gray-500 mb-1.5">Interests</div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {profile.interests.slice(0, 4).map((interest) => (
                                            <Badge key={interest} variant="secondary" className="text-xs">
                                                {interest}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {profile.lookingFor.length > 0 && (
                                <div>
                                    <div className="text-xs text-gray-500 mb-1.5">Looking For</div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {profile.lookingFor.slice(0, 3).map((item) => (
                                            <Badge key={item} className="bg-blue-100 text-blue-800 text-xs">
                                                {item}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
