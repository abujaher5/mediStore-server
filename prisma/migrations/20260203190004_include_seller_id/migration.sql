/*
  Warnings:

  - Added the required column `sellerId` to the `Medicine` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Medicine" ADD COLUMN     "sellerId" TEXT NOT NULL;
