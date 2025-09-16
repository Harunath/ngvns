/*
  Warnings:

  - You are about to drop the column `referralId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Onboarding" DROP CONSTRAINT "Onboarding_parentreferralId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_parentReferralId_fkey";

-- DropIndex
DROP INDEX "User_referralId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "referralId";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_parentReferralId_fkey" FOREIGN KEY ("parentReferralId") REFERENCES "User"("vrKpId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Onboarding" ADD CONSTRAINT "Onboarding_parentreferralId_fkey" FOREIGN KEY ("parentreferralId") REFERENCES "User"("vrKpId") ON DELETE SET NULL ON UPDATE CASCADE;
