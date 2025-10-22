/*
  Warnings:

  - You are about to drop the column `accountNumber` on the `BankDetails` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,accountNumberEnc]` on the table `BankDetails` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accountHolderName` to the `BankDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountNumberEnc` to the `BankDetails` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('SAVINGS', 'CURRENT');

-- AlterTable
ALTER TABLE "BankDetails" DROP COLUMN "accountNumber",
ADD COLUMN     "accountHolderName" TEXT NOT NULL,
ADD COLUMN     "accountNumberEnc" TEXT NOT NULL,
ADD COLUMN     "accountType" "AccountType" NOT NULL DEFAULT 'SAVINGS',
ADD COLUMN     "isPrimary" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "upiId" TEXT;

-- CreateIndex
CREATE INDEX "BankDetails_userId_idx" ON "BankDetails"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BankDetails_userId_accountNumberEnc_key" ON "BankDetails"("userId", "accountNumberEnc");
