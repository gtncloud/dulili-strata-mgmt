import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.findUnique({
        where: { email: "maintenance@dulili.com.au" },
        include: {
            memberships: {
                include: {
                    building: { select: { name: true } },
                },
            },
        },
    });

    console.log("Maintenance User:", JSON.stringify(user, null, 2));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
