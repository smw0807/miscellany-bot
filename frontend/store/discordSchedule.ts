import {
  ResultTypeEnum,
  type RepeatType,
  type ScheduleType,
} from '~/types/enums';
import type { NestHttpException } from '~/types/errors';

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
  const { useAlert } = useDialog();

  const ALERT_TITLE = '예약 메시지';
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
  const saveScheduleMessage = async (params: ScheduleMessageType) => {
    try {
      const res = await $fetch<string>('/api/supabase/schedule-message', {
        method: 'POST',
        body: JSON.stringify(params),
      });
      await useAlert({
        type: ResultTypeEnum.SUCCESS,
        title: ALERT_TITLE,
        message: res,
      });
    } catch (e: any) {
      const error: NestHttpException = e;
      await useAlert({
        type: ResultTypeEnum.ERROR,
        title: ALERT_TITLE,
        message: error.response?._data || error.message,
      });
    }
  };
  const asctions = { saveScheduleMessage };

  // ============= Returns =============
  return {
    ...state,
    ...asctions,
  };
});
