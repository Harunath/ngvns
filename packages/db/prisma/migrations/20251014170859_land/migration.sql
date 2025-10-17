-- CreateEnum
CREATE TYPE "LandUnitStatus" AS ENUM ('AVAILABLE', 'RESERVED', 'ALLOTTED', 'INACTIVE');

-- CreateEnum
CREATE TYPE "AllocationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "BenefitType" AS ENUM ('INSURANCE');

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "healthCareDocument" TEXT;

-- CreateTable
CREATE TABLE "VRKP_Card" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cardIssuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cardNumber" TEXT NOT NULL,
    "cardUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VRKP_Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LandParcel" (
    "id" TEXT NOT NULL,
    "stateId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "surveyNumber" TEXT NOT NULL,
    "areaSqYards" INTEGER NOT NULL,
    "addressLine" TEXT,
    "latitude" DECIMAL(9,6),
    "longitude" DECIMAL(9,6),
    "unitsTotal" INTEGER NOT NULL,
    "unitsAvailable" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LandParcel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LandParcelUnit" (
    "id" TEXT NOT NULL,
    "landParcelId" TEXT NOT NULL,
    "unitNumber" INTEGER NOT NULL,
    "status" "LandUnitStatus" NOT NULL DEFAULT 'AVAILABLE',
    "lockedUntil" TIMESTAMP(3),
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LandParcelUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LandAllocation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "landParcelUnitId" TEXT NOT NULL,
    "status" "AllocationStatus" NOT NULL DEFAULT 'CONFIRMED',
    "referenceNo" TEXT NOT NULL,
    "allocatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "allocatedById" TEXT,
    "docPdfUrl" TEXT,
    "stateId" TEXT NOT NULL,
    "landParcelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LandAllocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Benefit" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "BenefitType" "BenefitType" NOT NULL DEFAULT 'INSURANCE',
    "content" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    "details" JSONB,
    "docUrls" TEXT[],
    "createdById" TEXT,
    "issuedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "validUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Benefit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VRKP_Card_userId_key" ON "VRKP_Card"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VRKP_Card_cardNumber_key" ON "VRKP_Card"("cardNumber");

-- CreateIndex
CREATE INDEX "LandParcel_stateId_idx" ON "LandParcel"("stateId");

-- CreateIndex
CREATE INDEX "LandParcel_surveyNumber_idx" ON "LandParcel"("surveyNumber");

-- CreateIndex
CREATE INDEX "LandParcel_unitsAvailable_idx" ON "LandParcel"("unitsAvailable");

-- CreateIndex
CREATE UNIQUE INDEX "LandParcel_stateId_surveyNumber_key" ON "LandParcel"("stateId", "surveyNumber");

-- CreateIndex
CREATE INDEX "LandParcelUnit_status_idx" ON "LandParcelUnit"("status");

-- CreateIndex
CREATE INDEX "LandParcelUnit_lockedUntil_idx" ON "LandParcelUnit"("lockedUntil");

-- CreateIndex
CREATE UNIQUE INDEX "LandParcelUnit_landParcelId_unitNumber_key" ON "LandParcelUnit"("landParcelId", "unitNumber");

-- CreateIndex
CREATE UNIQUE INDEX "LandAllocation_landParcelUnitId_key" ON "LandAllocation"("landParcelUnitId");

-- CreateIndex
CREATE UNIQUE INDEX "LandAllocation_referenceNo_key" ON "LandAllocation"("referenceNo");

-- CreateIndex
CREATE INDEX "LandAllocation_userId_idx" ON "LandAllocation"("userId");

-- CreateIndex
CREATE INDEX "LandAllocation_stateId_idx" ON "LandAllocation"("stateId");

-- CreateIndex
CREATE INDEX "LandAllocation_landParcelId_idx" ON "LandAllocation"("landParcelId");

-- CreateIndex
CREATE INDEX "LandAllocation_allocatedAt_idx" ON "LandAllocation"("allocatedAt");

-- AddForeignKey
ALTER TABLE "VRKP_Card" ADD CONSTRAINT "VRKP_Card_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LandParcel" ADD CONSTRAINT "LandParcel_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "States"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LandParcelUnit" ADD CONSTRAINT "LandParcelUnit_landParcelId_fkey" FOREIGN KEY ("landParcelId") REFERENCES "LandParcel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LandAllocation" ADD CONSTRAINT "LandAllocation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LandAllocation" ADD CONSTRAINT "LandAllocation_landParcelUnitId_fkey" FOREIGN KEY ("landParcelUnitId") REFERENCES "LandParcelUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LandAllocation" ADD CONSTRAINT "LandAllocation_allocatedById_fkey" FOREIGN KEY ("allocatedById") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LandAllocation" ADD CONSTRAINT "LandAllocation_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "States"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LandAllocation" ADD CONSTRAINT "LandAllocation_landParcelId_fkey" FOREIGN KEY ("landParcelId") REFERENCES "LandParcel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Benefit" ADD CONSTRAINT "Benefit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Benefit" ADD CONSTRAINT "Benefit_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
