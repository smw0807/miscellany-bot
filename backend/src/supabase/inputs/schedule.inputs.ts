import { RepeatType, ScheduleType, SendStatus } from '@prisma/client';

export type ScheduleMessageInput = {
  guildId: string;
  channelId: string;
  isEveryone: boolean;
  isUse: boolean;
  title: string;
  messageContent: string;
  scheduleType: ScheduleType;
  scheduledAt: string;
  repeatInterval?: number;
  repeatType?: RepeatType;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  sendStatus: SendStatus;
  lastSentAt?: string;
};
