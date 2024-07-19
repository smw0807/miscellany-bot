/*
  Warnings:

  - You are about to drop the column `isSend` on the `scheduled_messages` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SendStatus" AS ENUM ('SUCCESS', 'WAIT', 'FAIL');

-- AlterTable
ALTER TABLE "scheduled_messages" DROP COLUMN "isSend",
ADD COLUMN     "sendStatus" "SendStatus" NOT NULL DEFAULT 'WAIT';
