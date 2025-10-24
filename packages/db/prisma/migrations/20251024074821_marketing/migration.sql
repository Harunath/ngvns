-- CreateEnum
CREATE TYPE "MarketingRole" AS ENUM ('MANAGER', 'TEAM_LEADER', 'AGENT');

-- CreateEnum
CREATE TYPE "AcquisitionType" AS ENUM ('USER_REFERRAL', 'MARKETING');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "acquisitionType" "AcquisitionType" NOT NULL DEFAULT 'USER_REFERRAL',
ADD COLUMN     "canRefer" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "MarketingTeam" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketingTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketingMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "role" "MarketingRole" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "MarketingMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MarketingTeam_name_key" ON "MarketingTeam"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MarketingMember_userId_key" ON "MarketingMember"("userId");

-- CreateIndex
CREATE INDEX "MarketingMember_teamId_role_isActive_idx" ON "MarketingMember"("teamId", "role", "isActive");

-- AddForeignKey
ALTER TABLE "MarketingMember" ADD CONSTRAINT "MarketingMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketingMember" ADD CONSTRAINT "MarketingMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "MarketingTeam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
