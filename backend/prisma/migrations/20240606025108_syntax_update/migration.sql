/*
  Warnings:

  - You are about to drop the column `tirrigerWord` on the `trigger_messages` table. All the data in the column will be lost.
  - Added the required column `triggerWord` to the `trigger_messages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "trigger_messages" DROP COLUMN "tirrigerWord",
ADD COLUMN     "triggerWord" TEXT NOT NULL;
