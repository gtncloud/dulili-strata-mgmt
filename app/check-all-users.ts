import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        include: {
            memberships: {
                include: {
                    building: { select: { name: true } },
                },
            },
        },
    });

    console.log("All Users:");
    users.forEach(user => {
        console.log("\n---");
        console.log(`Email: ${user.email}`);
        console.log(`Name: ${user.name}`);
        console.log(`Role: ${user.role}`);
        console.log(`Memberships: ${user.memberships.length}`);
        user.memberships.forEach(m => {
            console.log(`  - ${m.building.name} (${m.role}, ${m.status})`);
        });
    });
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
