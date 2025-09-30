-- CreateEnum
CREATE TYPE "SmsStatus" AS ENUM ('QUEUED', 'SUBMITTED', 'DELIVERED', 'FAILED');

-- CreateTable
CREATE TABLE "SmsMessage" (
    "id" TEXT NOT NULL,
    "mobile" VARCHAR(15) NOT NULL,
    "templateId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "campId" TEXT,
    "status" "SmsStatus" NOT NULL DEFAULT 'QUEUED',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "idempotencyKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SmsMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SmsMessage_campId_key" ON "SmsMessage"("campId");

-- CreateIndex
CREATE INDEX "SmsMessage_mobile_status_idx" ON "SmsMessage"("mobile", "status");

-- CreateIndex
CREATE INDEX "SmsMessage_idempotencyKey_idx" ON "SmsMessage"("idempotencyKey");
