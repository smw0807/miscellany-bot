import type { RepeatType, ScheduleType } from '~/types/enums';

// 예약 메시지 데이터 타입
export type ScheduleMessageType = {
  id?: number;
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
  isActive?: Boolean;
  lastSentAt?: string;
};

export const useDiscordScheduleStore = defineStore('discordSchedule', () => {
  // ============= State =============
  const guildId = ref<string>(''); // 길드 아이디
  const pageIndex = ref<number>(1); // 페이지 인덱스
  const pageSize = ref<number>(10); // 페이지 사이즈
  const total = ref<number>(0); // 전체 데이터 수
  const scheduleMessages = ref<ScheduleMessageType[]>([]); // 예약 메시지
  const state = {
    guildId,
    pageIndex,
    pageSize,
    total,
    scheduleMessages,
  };

  // ============= Actions =============
  const asctions = {};

  // ============= Returns =============
  return {
    ...state,
    ...asctions,
  };
});
