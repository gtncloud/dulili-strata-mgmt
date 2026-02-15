-- CreateTable
CREATE TABLE "LocalBusiness" (
    "id" TEXT NOT NULL,
    "buildingId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "address" TEXT,
    "hours" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isEmergency" BOOLEAN NOT NULL DEFAULT false,
    "addedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LocalBusiness_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocalBusinessReview" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LocalBusinessReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NeighborProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bio" TEXT,
    "interests" TEXT[],
    "lookingFor" TEXT[],
    "visibility" TEXT NOT NULL DEFAULT 'building',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NeighborProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NeighborConnection" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NeighborConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SustainabilityMetric" (
    "id" TEXT NOT NULL,
    "buildingId" TEXT NOT NULL,
    "metricType" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "period" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SustainabilityMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SustainabilityChallenge" (
    "id" TEXT NOT NULL,
    "buildingId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "goal" DOUBLE PRECISION NOT NULL,
    "current" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "unit" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "participants" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SustainabilityChallenge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LocalBusinessReview_businessId_userId_key" ON "LocalBusinessReview"("businessId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "NeighborProfile_userId_key" ON "NeighborProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "NeighborConnection_senderId_receiverId_key" ON "NeighborConnection"("senderId", "receiverId");

-- AddForeignKey
ALTER TABLE "LocalBusiness" ADD CONSTRAINT "LocalBusiness_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "Building"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocalBusiness" ADD CONSTRAINT "LocalBusiness_addedBy_fkey" FOREIGN KEY ("addedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocalBusinessReview" ADD CONSTRAINT "LocalBusinessReview_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "LocalBusiness"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocalBusinessReview" ADD CONSTRAINT "LocalBusinessReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NeighborProfile" ADD CONSTRAINT "NeighborProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NeighborConnection" ADD CONSTRAINT "NeighborConnection_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "NeighborProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NeighborConnection" ADD CONSTRAINT "NeighborConnection_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "NeighborProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SustainabilityMetric" ADD CONSTRAINT "SustainabilityMetric_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "Building"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SustainabilityChallenge" ADD CONSTRAINT "SustainabilityChallenge_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "Building"("id") ON DELETE CASCADE ON UPDATE CASCADE;
