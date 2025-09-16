-- AlterTable
ALTER TABLE "Onboarding" ADD COLUMN     "parentreferralId" TEXT;

-- AddForeignKey
ALTER TABLE "Onboarding" ADD CONSTRAINT "Onboarding_parentreferralId_fkey" FOREIGN KEY ("parentreferralId") REFERENCES "User"("referralId") ON DELETE SET NULL ON UPDATE CASCADE;
