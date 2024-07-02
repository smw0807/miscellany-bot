-- CreateEnum
CREATE TYPE "ScheduleType" AS ENUM ('ONETIME', 'RECURRING');

-- CreateEnum
CREATE TYPE "RepeatType" AS ENUM ('MINUTE', 'HOUR', 'DAY');

-- CreateTable
CREATE TABLE "scheduled_messages" (
    "id" SERIAL NOT NULL,
    "guildId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "scheduleType" "ScheduleType" NOT NULL,
    "title" TEXT NOT NULL,
    "messageContent" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "repeatType" "RepeatType",
    "repeatStartedAt" TIMESTAMP(3) NOT NULL,
    "repeatInterval" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastSentAt" TIMESTAMP(3),

    CONSTRAINT "scheduled_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "scheduled_messages_guildId_channelId_idx" ON "scheduled_messages"("guildId", "channelId");

-- CreateIndex
CREATE INDEX "send_messages_history_guildId_channelId_idx" ON "send_messages_history"("guildId", "channelId");

-- CreateIndex
CREATE INDEX "trigger_messages_guildId_triggerWord_idx" ON "trigger_messages"("guildId", "triggerWord");
