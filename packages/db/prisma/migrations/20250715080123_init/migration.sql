-- CreateEnum
CREATE TYPE "ADMIN_ROLE" AS ENUM ('SUPER', 'ADMIN', 'TRESASURAR');

-- CreateEnum
CREATE TYPE "GenderType" AS ENUM ('Male', 'Female', 'Others', 'None');

-- CreateEnum
CREATE TYPE "RelationType" AS ENUM ('S/o', 'D/o', 'W/o');

-- CreateEnum
CREATE TYPE "BloodGroupType" AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PROCESSING', 'PAID', 'FAILED', 'REFUNDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('INITIATED', 'PENDING', 'SUCCESS', 'FAILED', 'FLAGGED');

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "password" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "phone" TEXT,
    "phoneVerified" BOOLEAN DEFAULT false,
    "role" "ADMIN_ROLE" NOT NULL,
    "address" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "relationType" "RelationType" NOT NULL,
    "relationName" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "address" JSONB NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL,
    "aadhaar" TEXT NOT NULL,
    "aadhaarVerified" BOOLEAN NOT NULL,
    "gender" "GenderType" NOT NULL DEFAULT 'None',
    "userPhoto" TEXT NOT NULL,
    "referralId" TEXT NOT NULL,
    "nominieeName" TEXT NOT NULL,
    "nominieeDob" TIMESTAMP(3) NOT NULL,
    "relationship" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deactivated" BOOLEAN NOT NULL DEFAULT false,
    "onBoardingId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Onboarding" (
    "id" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "relationType" "RelationType" NOT NULL,
    "relationName" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "address" JSONB NOT NULL,
    "phone" TEXT NOT NULL,
    "phoneVerified" BOOLEAN NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL,
    "aadhaar" TEXT NOT NULL,
    "aadhaarVerified" BOOLEAN NOT NULL,
    "gender" "GenderType" NOT NULL DEFAULT 'None',
    "userPhoto" TEXT NOT NULL,
    "nominieeName" TEXT NOT NULL,
    "nominieeDob" TIMESTAMP(3) NOT NULL,
    "relationship" TEXT NOT NULL,
    "referralId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Onboarding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankDetails" (
    "id" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "ifscCode" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthCard" (
    "id" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "relationType" "RelationType" NOT NULL,
    "relationName" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "address" JSONB NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "gender" "GenderType" NOT NULL DEFAULT 'None',
    "aadhaar" TEXT NOT NULL,
    "emergencyContact" TEXT NOT NULL,
    "bloodGroup" "BloodGroupType" NOT NULL,
    "bp" BOOLEAN NOT NULL DEFAULT false,
    "diabetices" BOOLEAN NOT NULL DEFAULT false,
    "anySurgeries" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HealthCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GmailVerificationCode" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GmailVerificationCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhoneVerificationCode" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PhoneVerificationCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "cashfreeOrderId" TEXT NOT NULL,
    "paymentSessionId" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "totalAmount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "notes" TEXT,
    "itemDetailsSnapshot" JSONB,
    "onBoardingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "cashfreeOrderId" TEXT NOT NULL,
    "paymentSessionId" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'INITIATED',
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "paymentMethod" TEXT,
    "gatewayResponse" JSONB,
    "errorMessage" TEXT,
    "processedAt" TIMESTAMP(3),
    "orderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_phone_key" ON "Admin"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_referralId_key" ON "User"("referralId");

-- CreateIndex
CREATE UNIQUE INDEX "User_onBoardingId_key" ON "User"("onBoardingId");

-- CreateIndex
CREATE UNIQUE INDEX "User_orderId_key" ON "User"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Onboarding_phone_key" ON "Onboarding"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Onboarding_referralId_key" ON "Onboarding"("referralId");

-- CreateIndex
CREATE UNIQUE INDEX "BankDetails_userId_key" ON "BankDetails"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "HealthCard_phone_key" ON "HealthCard"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "HealthCard_email_key" ON "HealthCard"("email");

-- CreateIndex
CREATE UNIQUE INDEX "GmailVerificationCode_email_key" ON "GmailVerificationCode"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PhoneVerificationCode_phone_key" ON "PhoneVerificationCode"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Order_cashfreeOrderId_key" ON "Order"("cashfreeOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_paymentSessionId_key" ON "Order"("paymentSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_cashfreeOrderId_key" ON "Payment"("cashfreeOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_paymentSessionId_key" ON "Payment"("paymentSessionId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_onBoardingId_fkey" FOREIGN KEY ("onBoardingId") REFERENCES "Onboarding"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankDetails" ADD CONSTRAINT "BankDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_onBoardingId_fkey" FOREIGN KEY ("onBoardingId") REFERENCES "Onboarding"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
