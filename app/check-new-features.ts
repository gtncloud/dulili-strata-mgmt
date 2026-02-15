import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("\n🔍 Checking Phase 1 Features Data...\n");

    // Check Local Businesses
    const businesses = await prisma.localBusiness.findMany({
        include: { reviews: true },
    });
    console.log(`📍 Local Businesses: ${businesses.length} found`);
    businesses.forEach((b) => {
        console.log(`   - ${b.name} (${b.category}) ${b.isVerified ? "✓ Verified" : ""} ${b.isEmergency ? "🚨 Emergency" : ""}`);
    });

    // Check Neighbor Profiles
    const profiles = await prisma.neighborProfile.findMany({
        include: { user: { select: { name: true } } },
    });
    console.log(`\n👥 Neighbor Profiles: ${profiles.length} found`);
    profiles.forEach((p) => {
        console.log(`   - ${p.user.name}: ${p.interests.join(", ")}`);
    });

    // Check Sustainability Metrics
    const metrics = await prisma.sustainabilityMetric.findMany();
    console.log(`\n🌱 Sustainability Metrics: ${metrics.length} found`);
    metrics.forEach((m) => {
        console.log(`   - ${m.metricType}: ${m.value} ${m.unit}`);
    });

    // Check Sustainability Challenges
    const challenges = await prisma.sustainabilityChallenge.findMany();
    console.log(`\n🎯 Sustainability Challenges: ${challenges.length} found`);
    challenges.forEach((c) => {
        console.log(`   - ${c.title}: ${c.current}/${c.goal} ${c.unit}`);
    });

    console.log("\n✅ All data is in the database!\n");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
