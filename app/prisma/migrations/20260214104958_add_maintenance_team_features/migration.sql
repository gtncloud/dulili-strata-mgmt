-- AlterTable
ALTER TABLE "MaintenanceRequest" ADD COLUMN     "actualHours" DOUBLE PRECISION,
ADD COLUMN     "completionNotes" TEXT,
ADD COLUMN     "estimatedHours" DOUBLE PRECISION,
ADD COLUMN     "workNotes" TEXT;

-- CreateTable
CREATE TABLE "MaintenanceWorkLog" (
    "id" TEXT NOT NULL,
    "maintenanceRequestId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "notes" TEXT,
    "oldStatus" TEXT,
    "newStatus" TEXT,
    "hoursWorked" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MaintenanceWorkLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MaintenanceWorkLog" ADD CONSTRAINT "MaintenanceWorkLog_maintenanceRequestId_fkey" FOREIGN KEY ("maintenanceRequestId") REFERENCES "MaintenanceRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceWorkLog" ADD CONSTRAINT "MaintenanceWorkLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
