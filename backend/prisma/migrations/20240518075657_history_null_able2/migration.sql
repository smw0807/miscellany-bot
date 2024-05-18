-- AlterTable
ALTER TABLE "send_messages_history" ALTER COLUMN "guildName" DROP NOT NULL,
ALTER COLUMN "channelName" DROP NOT NULL,
ALTER COLUMN "createdAt" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL;
