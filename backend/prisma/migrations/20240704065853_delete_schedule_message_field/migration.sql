/*
  Warnings:

  - You are about to drop the column `createdBy` on the `scheduled_messages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "scheduled_messages" DROP COLUMN "createdBy";
