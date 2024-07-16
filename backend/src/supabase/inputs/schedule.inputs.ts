import { RepeatType, ScheduleType } from '@prisma/client';

export type ScheduleMessageInsertInput = {
  guildId: string;
  channelId: string;
  isEveryone: boolean;
  title: string;
  messageContent: string;
  scheduleType: ScheduleType;
  scheduledAt: string;
  repeatInterval?: number;
  repeatType?: RepeatType;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  isSend: boolean;
  lastSentAt?: string;
};
