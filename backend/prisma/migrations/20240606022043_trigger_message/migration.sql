-- CreateTable
CREATE TABLE "trigger_messages" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "guildName" TEXT,
    "userId" TEXT,
    "tirrigerWord" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isEveryone" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "trigger_messages_pkey" PRIMARY KEY ("id")
);
