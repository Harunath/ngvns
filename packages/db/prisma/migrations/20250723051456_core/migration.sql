/*
  Warnings:

  - You are about to drop the column `cashfreeOrderId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `cashfreeOrderId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the `HealthCard` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[paymentOrderId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[paymentOrderId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `paymentOrderId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentOrderId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TCOptions" AS ENUM ('ACCEPTED', 'REJECTED');

-- DropIndex
DROP INDEX "Order_cashfreeOrderId_key";

-- DropIndex
DROP INDEX "Payment_cashfreeOrderId_key";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "cashfreeOrderId",
ADD COLUMN     "paymentOrderId" TEXT NOT NULL,
ALTER COLUMN "totalAmount" SET DEFAULT 3999;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "cashfreeOrderId",
ADD COLUMN     "paymentOrderId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "healthCard" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "parentBId" TEXT,
ADD COLUMN     "parentCId" TEXT,
ADD COLUMN     "parentReferralId" TEXT;

-- DropTable
DROP TABLE "HealthCard";

-- DropEnum
DROP TYPE "BloodGroupType";

-- CreateTable
CREATE TABLE "TnCVersion" (
    "id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TnCVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TnCAcceptance" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "onboardingId" TEXT NOT NULL,
    "tncVersionId" TEXT NOT NULL,
    "acceptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TnCAcceptance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TnCAcceptance_userId_key" ON "TnCAcceptance"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TnCAcceptance_onboardingId_key" ON "TnCAcceptance"("onboardingId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_paymentOrderId_key" ON "Order"("paymentOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_paymentOrderId_key" ON "Payment"("paymentOrderId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_parentReferralId_fkey" FOREIGN KEY ("parentReferralId") REFERENCES "User"("referralId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TnCAcceptance" ADD CONSTRAINT "TnCAcceptance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TnCAcceptance" ADD CONSTRAINT "TnCAcceptance_onboardingId_fkey" FOREIGN KEY ("onboardingId") REFERENCES "Onboarding"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TnCAcceptance" ADD CONSTRAINT "TnCAcceptance_tncVersionId_fkey" FOREIGN KEY ("tncVersionId") REFERENCES "TnCVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
