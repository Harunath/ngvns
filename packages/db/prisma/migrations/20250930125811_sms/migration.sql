-- AlterTable
ALTER TABLE "SmsMessage" ADD COLUMN     "processingExpiresAt" TIMESTAMP(3),
ADD COLUMN     "processingToken" TEXT;
