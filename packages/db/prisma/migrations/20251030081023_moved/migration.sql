-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_byAcquisitionId_fkey";

-- CreateIndex
CREATE INDEX "MarketingMember_userId_isActive_idx" ON "MarketingMember"("userId", "isActive");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_byAcquisitionId_fkey" FOREIGN KEY ("byAcquisitionId") REFERENCES "MarketingMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;
