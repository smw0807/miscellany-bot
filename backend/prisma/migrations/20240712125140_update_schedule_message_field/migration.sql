/*
  Warnings:

  - The primary key for the `scheduled_messages` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "scheduled_messages" DROP CONSTRAINT "scheduled_messages_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "scheduled_messages_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "scheduled_messages_id_seq";
