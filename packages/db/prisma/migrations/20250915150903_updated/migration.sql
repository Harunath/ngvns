/*
  Warnings:

  - You are about to drop the column `itemDetailsSnapshot` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `paymentSessionId` on the `Order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Order_paymentSessionId_key";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "itemDetailsSnapshot",
DROP COLUMN "paymentSessionId",
ADD COLUMN     "email" TEXT,
ADD COLUMN     "orderId" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT,
ALTER COLUMN "totalAmount" SET DEFAULT 4999;

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderId_key" ON "Order"("orderId");
