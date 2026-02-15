import { redirect } from "next/navigation";
import { verifySession } from "@/lib/session";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, Zap, Droplet, Trash2, Recycle, TrendingDown, Target } from "lucide-react";

const metricIcons = {
    energy: Zap,
    water: Droplet,
    waste: Trash2,
    recycling: Recycle,
};

const metricColors = {
    energy: "bg-yellow-100 text-yellow-800",
    water: "bg-blue-100 text-blue-800",
    waste: "bg-gray-100 text-gray-800",
    recycling: "bg-green-100 text-green-800",
};

export default async function SustainabilityPage() {
    const session = await verifySession();
    if (!session?.isAuth) redirect("/auth/login");

    const membership = await db.buildingMembership.findFirst({
        where: { userId: session.userId, status: "active" },
    });

    if (!membership) redirect("/dashboard");

    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const metrics = await db.sustainabilityMetric.findMany({
        where: {
            buildingId: membership.buildingId,
            period: currentMonth,
        },
        orderBy: { metricType: "asc" },
    });

    const challenges = await db.sustainabilityChallenge.findMany({
        where: {
            buildingId: membership.buildingId,
            endDate: { gte: new Date() },
        },
        orderBy: { endDate: "asc" },
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">Sustainability Dashboard</h1>
                <p className="text-sm text-gray-600 mt-1">
                    Track our building's environmental impact and join challenges
                </p>
            </div>

            {/* Current Month Metrics */}
            <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">This Month's Metrics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {metrics.map((metric) => {
                        const Icon = metricIcons[metric.metricType as keyof typeof metricIcons] || Leaf;
                        return (
                            <Card key={metric.id} className="p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <Badge className={metricColors[metric.metricType as keyof typeof metricColors]}>
                                        <Icon className="h-3 w-3 mr-1" />
                                        {metric.metricType}
                                    </Badge>
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-1">
                                    {metric.value.toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-600">{metric.unit}</div>
                                {metric.notes && (
                                    <div className="text-xs text-gray-500 mt-2">{metric.notes}</div>
                                )}
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* Active Challenges */}
            <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Active Challenges</h2>
                {challenges.length === 0 ? (
                    <Card className="p-12 text-center">
                        <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No active challenges</h3>
                        <p className="text-sm text-gray-600">
                            Check back soon for new sustainability challenges!
                        </p>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {challenges.map((challenge) => {
                            const progress = (challenge.current / challenge.goal) * 100;
                            const isOnTrack = challenge.current <= challenge.goal;

                            return (
                                <Card key={challenge.id} className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-1">{challenge.title}</h3>
                                            <p className="text-sm text-gray-600">{challenge.description}</p>
                                        </div>
                                        <Badge className={isOnTrack ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}>
                                            <TrendingDown className="h-3 w-3 mr-1" />
                                            {isOnTrack ? "On Track" : "In Progress"}
                                        </Badge>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Progress</span>
                                            <span className="font-medium text-gray-900">
                                                {challenge.current.toLocaleString()} / {challenge.goal.toLocaleString()} {challenge.unit}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${isOnTrack ? "bg-green-500" : "bg-amber-500"}`}
                                                style={{ width: `${Math.min(progress, 100)}%` }}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <span>{challenge.participants} participants</span>
                                            <span>Ends {new Date(challenge.endDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Info Card */}
            <Card className="p-6 bg-green-50 border-green-200">
                <div className="flex items-start gap-4">
                    <Leaf className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-medium text-gray-900 mb-1">Building a Sustainable Future</h3>
                        <p className="text-sm text-gray-600">
                            Every small action counts! By tracking our environmental impact and working together on challenges,
                            we can reduce our building's carbon footprint and create a more sustainable community.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
