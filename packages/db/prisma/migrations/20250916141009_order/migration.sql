/*
  Warnings:

  - You are about to drop the column `paymentOrderId` on the `Order` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Order_paymentOrderId_key";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "paymentOrderId";
