/*
  Warnings:

  - You are about to drop the column `repeatStartedAt` on the `scheduled_messages` table. All the data in the column will be lost.
  - You are about to drop the column `repeatType` on the `scheduled_messages` table. All the data in the column will be lost.
  - The `repeatInterval` column on the `scheduled_messages` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "scheduled_messages" DROP COLUMN "repeatStartedAt",
DROP COLUMN "repeatType",
ADD COLUMN     "repeatedAt" TIMESTAMP(3),
ALTER COLUMN "scheduledAt" DROP NOT NULL,
DROP COLUMN "repeatInterval",
ADD COLUMN     "repeatInterval" "RepeatType";
