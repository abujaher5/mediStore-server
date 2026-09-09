-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "role_change_request" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currentRole" TEXT NOT NULL,
    "requestedRole" TEXT NOT NULL,
    "reason" TEXT,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "role_change_request_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "role_change_request_userId_idx" ON "role_change_request"("userId");

-- AddForeignKey
ALTER TABLE "role_change_request" ADD CONSTRAINT "role_change_request_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
