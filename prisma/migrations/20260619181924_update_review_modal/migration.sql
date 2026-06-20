/*
  Warnings:

  - You are about to drop the column `comment` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `medicineId` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Review` table. All the data in the column will be lost.
  - Added the required column `designation` to the `Review` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Review` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `quote` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_medicineId_fkey";

-- DropIndex
DROP INDEX "Review_medicineId_idx";

-- DropIndex
DROP INDEX "Review_userId_medicineId_key";

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "comment",
DROP COLUMN "medicineId",
DROP COLUMN "rating",
ADD COLUMN     "designation" TEXT NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "quote" TEXT NOT NULL,
ADD CONSTRAINT "Review_pkey" PRIMARY KEY ("id");
