import { RepeatType, ScheduleType } from '@prisma/client';

export type ScheduleMessageType = {
  id?: string;
  guildId?: string;
  channelId: string;
  title: string;
  messageContent: string;
  scheduleType: ScheduleType;
  scheduledAt?: string;
  repeatedAt?: string;
  repeatInterval?: number;
  repeatType?: RepeatType;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  isSend?: boolean;
  lastSentAt?: string;
};
