-- AlterTable
ALTER TABLE "scheduled_messages" ADD COLUMN     "isUse" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "trigger_messages" ADD COLUMN     "isUse" BOOLEAN NOT NULL DEFAULT true;
