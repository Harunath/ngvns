/*
  Warnings:

  - You are about to drop the column `address` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `phoneVerified` on the `Admin` table. All the data in the column will be lost.
  - Changed the type of `role` on the `Admin` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('ROOT', 'SUPER', 'COMMAND', 'FINANCE', 'DATA_ENTRY');

-- CreateEnum
CREATE TYPE "UserPaymentsType" AS ENUM ('LEVEL1', 'LEVEL2', 'LEVEL3', 'L1BAR', 'L2BAR', 'L3BAR');

-- CreateEnum
CREATE TYPE "PayoutStatus" AS ENUM ('REQUESTED', 'APPROVED', 'PAID', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "BatchStatus" AS ENUM ('DRAFT', 'READY', 'APPROVED', 'POSTED', 'DISBURSED', 'RECONCILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('INR');

-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "address",
DROP COLUMN "phoneVerified",
ADD COLUMN     "totpEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "totpSecret" TEXT,
DROP COLUMN "role",
ADD COLUMN     "role" "AdminRole" NOT NULL;

-- DropEnum
DROP TYPE "ADMIN_ROLE";

-- CreateTable
CREATE TABLE "UserPayments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "UserPaymentsType" NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'INITIATED',
    "paymentDetails" JSONB,
    "paymentDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPayments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPayoutType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "defaultAmountPaise" BIGINT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPayoutType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayoutBatch" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "BatchStatus" NOT NULL DEFAULT 'DRAFT',
    "createdById" TEXT NOT NULL,
    "approvedById" TEXT,
    "currency" "Currency" NOT NULL DEFAULT 'INR',
    "totalAmountPaise" BIGINT NOT NULL DEFAULT 0,
    "scheduledAt" TIMESTAMP(3),
    "postedAt" TIMESTAMP(3),
    "disbursedAt" TIMESTAMP(3),
    "reconciledAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PayoutBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPayout" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,
    "requestedAmountPaise" BIGINT NOT NULL,
    "approvedAmountPaise" BIGINT,
    "currency" "Currency" NOT NULL DEFAULT 'INR',
    "status" "PayoutStatus" NOT NULL DEFAULT 'REQUESTED',
    "requestedById" TEXT,
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "paymentDate" TIMESTAMP(3),
    "bankReference" TEXT,
    "paymentDetails" JSONB,
    "batchId" TEXT,
    "idempotencyKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPayout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayoutAttachment" (
    "id" TEXT NOT NULL,
    "payoutBatchId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "fileUrl" TEXT,
    "note" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PayoutAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminPermission" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "id" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL,
    "permissionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminAuditLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT,
    "action" TEXT NOT NULL,
    "reason" TEXT,
    "metadata" JSONB,
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserPayments_userId_status_type_idx" ON "UserPayments"("userId", "status", "type");

-- CreateIndex
CREATE INDEX "UserPayments_userId_idx" ON "UserPayments"("userId");

-- CreateIndex
CREATE INDEX "UserPayments_status_idx" ON "UserPayments"("status");

-- CreateIndex
CREATE INDEX "UserPayments_type_idx" ON "UserPayments"("type");

-- CreateIndex
CREATE UNIQUE INDEX "UserPayoutType_name_key" ON "UserPayoutType"("name");

-- CreateIndex
CREATE INDEX "PayoutBatch_status_createdAt_idx" ON "PayoutBatch"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserPayout_idempotencyKey_key" ON "UserPayout"("idempotencyKey");

-- CreateIndex
CREATE INDEX "UserPayout_userId_status_createdAt_idx" ON "UserPayout"("userId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "UserPayout_batchId_status_idx" ON "UserPayout"("batchId", "status");

-- CreateIndex
CREATE INDEX "PayoutAttachment_payoutBatchId_kind_idx" ON "PayoutAttachment"("payoutBatchId", "kind");

-- CreateIndex
CREATE UNIQUE INDEX "AdminPermission_code_key" ON "AdminPermission"("code");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_role_permissionId_key" ON "RolePermission"("role", "permissionId");

-- CreateIndex
CREATE INDEX "AdminAuditLog_targetType_targetId_idx" ON "AdminAuditLog"("targetType", "targetId");

-- CreateIndex
CREATE INDEX "AdminAuditLog_action_createdAt_idx" ON "AdminAuditLog"("action", "createdAt");

-- CreateIndex
CREATE INDEX "Onboarding_id_phone_idx" ON "Onboarding"("id", "phone");

-- CreateIndex
CREATE INDEX "Onboarding_id_idx" ON "Onboarding"("id");

-- CreateIndex
CREATE INDEX "Onboarding_phone_idx" ON "Onboarding"("phone");

-- CreateIndex
CREATE INDEX "Order_orderId_idx" ON "Order"("orderId");

-- CreateIndex
CREATE INDEX "User_id_idx" ON "User"("id");

-- CreateIndex
CREATE INDEX "User_vrKpId_idx" ON "User"("vrKpId");

-- CreateIndex
CREATE INDEX "User_phone_idx" ON "User"("phone");

-- AddForeignKey
ALTER TABLE "UserPayments" ADD CONSTRAINT "UserPayments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayoutBatch" ADD CONSTRAINT "PayoutBatch_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayoutBatch" ADD CONSTRAINT "PayoutBatch_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPayout" ADD CONSTRAINT "UserPayout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPayout" ADD CONSTRAINT "UserPayout_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "UserPayoutType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPayout" ADD CONSTRAINT "UserPayout_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPayout" ADD CONSTRAINT "UserPayout_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPayout" ADD CONSTRAINT "UserPayout_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "PayoutBatch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayoutAttachment" ADD CONSTRAINT "PayoutAttachment_payoutBatchId_fkey" FOREIGN KEY ("payoutBatchId") REFERENCES "PayoutBatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayoutAttachment" ADD CONSTRAINT "PayoutAttachment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "AdminPermission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminAuditLog" ADD CONSTRAINT "AdminAuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
