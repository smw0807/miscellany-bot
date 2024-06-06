/*
  Warnings:

  - You are about to drop the column `guildName` on the `trigger_messages` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `trigger_messages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "trigger_messages" DROP COLUMN "guildName",
DROP COLUMN "userId";
