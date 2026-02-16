-- CreateTable
CREATE TABLE "FireSafetySchedule" (
    "id" TEXT NOT NULL,
    "buildingId" TEXT NOT NULL,
    "issuedBy" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "documentUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FireSafetySchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FireSafetyMeasure" (
    "id" TEXT NOT NULL,
    "scheduleId" TEXT,
    "buildingId" TEXT NOT NULL,
    "measureType" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "standard" TEXT NOT NULL DEFAULT 'AS1851-2012',
    "testingFrequency" TEXT NOT NULL,
    "lastTested" TIMESTAMP(3),
    "nextTestDue" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'compliant',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FireSafetyMeasure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnnualFireSafetyStatement" (
    "id" TEXT NOT NULL,
    "buildingId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "issueDate" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "practitionerName" TEXT,
    "practitionerNumber" TEXT,
    "submittedToCouncil" BOOLEAN NOT NULL DEFAULT false,
    "councilSubmissionDate" TIMESTAMP(3),
    "submittedToFireRescue" BOOLEAN NOT NULL DEFAULT false,
    "fireRescueSubmissionDate" TIMESTAMP(3),
    "certificateUrl" TEXT,
    "displayedInBuilding" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnnualFireSafetyStatement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FireSafetyInspection" (
    "id" TEXT NOT NULL,
    "buildingId" TEXT NOT NULL,
    "measureId" TEXT NOT NULL,
    "inspectionDate" TIMESTAMP(3) NOT NULL,
    "inspectorName" TEXT NOT NULL,
    "inspectorCompany" TEXT,
    "result" TEXT NOT NULL,
    "findings" TEXT,
    "correctiveActions" TEXT,
    "nextInspectionDue" TIMESTAMP(3) NOT NULL,
    "certificateUrl" TEXT,
    "cost" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FireSafetyInspection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmergencyPlan" (
    "id" TEXT NOT NULL,
    "buildingId" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "approvedDate" TIMESTAMP(3) NOT NULL,
    "evacuationProcedure" TEXT NOT NULL,
    "assemblyPoints" TEXT NOT NULL,
    "emergencyContacts" TEXT NOT NULL,
    "lastDrillDate" TIMESTAMP(3),
    "nextDrillDue" TIMESTAMP(3) NOT NULL,
    "documentUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmergencyPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LevyPaymentPlan" (
    "id" TEXT NOT NULL,
    "buildingId" TEXT NOT NULL,
    "lotId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "requestDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "responseDate" TIMESTAMP(3),
    "approvedDate" TIMESTAMP(3),
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "totalOwed" DOUBLE PRECISION NOT NULL,
    "interestOwed" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "recoveryCosts" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "installmentAmount" DOUBLE PRECISION NOT NULL,
    "installmentFrequency" TEXT NOT NULL,
    "numberOfInstallments" INTEGER NOT NULL,
    "paidInstallments" INTEGER NOT NULL DEFAULT 0,
    "requestInterestWaiver" BOOLEAN NOT NULL DEFAULT false,
    "interestWaived" BOOLEAN NOT NULL DEFAULT false,
    "refusalReason" TEXT,
    "approvedBy" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LevyPaymentPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentPlanPayment" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "installmentNumber" INTEGER NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "paidDate" TIMESTAMP(3),
    "paidAmount" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "paymentReference" TEXT,
    "appliedToLevies" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "appliedToInterest" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "appliedToCosts" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentPlanPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentPlanExtension" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "requestDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "requestedEndDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "reason" TEXT NOT NULL,
    "responseDate" TIMESTAMP(3),
    "approvedBy" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentPlanExtension_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DebtRecoveryAction" (
    "id" TEXT NOT NULL,
    "buildingId" TEXT NOT NULL,
    "lotId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "actionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'pending',
    "amountOwed" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "documentUrl" TEXT,
    "tribunalOrderNumber" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DebtRecoveryAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LevyReminder" (
    "id" TEXT NOT NULL,
    "levyId" TEXT NOT NULL,
    "sentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reminderType" TEXT NOT NULL,
    "sentTo" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'sent',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LevyReminder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AnnualFireSafetyStatement_buildingId_year_key" ON "AnnualFireSafetyStatement"("buildingId", "year");

-- AddForeignKey
ALTER TABLE "FireSafetySchedule" ADD CONSTRAINT "FireSafetySchedule_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "Building"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FireSafetyMeasure" ADD CONSTRAINT "FireSafetyMeasure_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "FireSafetySchedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FireSafetyMeasure" ADD CONSTRAINT "FireSafetyMeasure_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "Building"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnnualFireSafetyStatement" ADD CONSTRAINT "AnnualFireSafetyStatement_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "Building"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FireSafetyInspection" ADD CONSTRAINT "FireSafetyInspection_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "Building"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FireSafetyInspection" ADD CONSTRAINT "FireSafetyInspection_measureId_fkey" FOREIGN KEY ("measureId") REFERENCES "FireSafetyMeasure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmergencyPlan" ADD CONSTRAINT "EmergencyPlan_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "Building"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LevyPaymentPlan" ADD CONSTRAINT "LevyPaymentPlan_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "Building"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LevyPaymentPlan" ADD CONSTRAINT "LevyPaymentPlan_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "Lot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LevyPaymentPlan" ADD CONSTRAINT "LevyPaymentPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentPlanPayment" ADD CONSTRAINT "PaymentPlanPayment_planId_fkey" FOREIGN KEY ("planId") REFERENCES "LevyPaymentPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentPlanExtension" ADD CONSTRAINT "PaymentPlanExtension_planId_fkey" FOREIGN KEY ("planId") REFERENCES "LevyPaymentPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DebtRecoveryAction" ADD CONSTRAINT "DebtRecoveryAction_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "Building"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DebtRecoveryAction" ADD CONSTRAINT "DebtRecoveryAction_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "Lot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DebtRecoveryAction" ADD CONSTRAINT "DebtRecoveryAction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LevyReminder" ADD CONSTRAINT "LevyReminder_levyId_fkey" FOREIGN KEY ("levyId") REFERENCES "Levy"("id") ON DELETE CASCADE ON UPDATE CASCADE;
