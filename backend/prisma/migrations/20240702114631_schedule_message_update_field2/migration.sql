/*
  Warnings:

  - The `repeatInterval` column on the `scheduled_messages` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "scheduled_messages" ADD COLUMN     "repeatType" "RepeatType",
DROP COLUMN "repeatInterval",
ADD COLUMN     "repeatInterval" INTEGER;
