-- AlterTable
ALTER TABLE "User" ADD COLUMN     "byAcquisitionId" TEXT,
ADD COLUMN     "byMarketingTeamId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_byAcquisitionId_fkey" FOREIGN KEY ("byAcquisitionId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_byMarketingTeamId_fkey" FOREIGN KEY ("byMarketingTeamId") REFERENCES "MarketingTeam"("id") ON DELETE SET NULL ON UPDATE CASCADE;
