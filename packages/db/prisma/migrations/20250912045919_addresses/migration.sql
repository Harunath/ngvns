/*
  Warnings:

  - A unique constraint covering the columns `[vrKpId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `pincode` to the `Onboarding` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vrKpId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Onboarding" ADD COLUMN     "pincode" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "vrKpId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "addressLine" TEXT NOT NULL,
    "addressLine2" TEXT,
    "StateId" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "States" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "isActive" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "States_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_vrKpId_key" ON "User"("vrKpId");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_StateId_fkey" FOREIGN KEY ("StateId") REFERENCES "States"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
