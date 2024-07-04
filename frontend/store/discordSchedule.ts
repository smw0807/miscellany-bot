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

export type ScheduleMessagesListResponseType = {
  data: ScheduleMessageType[];
  total: number;
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
  // 예약 메시지 목록 조회
  const getScheduleMessages = async () => {
    try {
      const res = await $fetch<ScheduleMessagesListResponseType>(
        '/api/supabase/schedule-messages',
        {
          method: 'GET',
          params: {
            guildId: guildId.value,
            pageSize: pageSize.value,
            pageIndex: pageIndex.value - 1,
          },
        }
      );
      total.value = res.total;
      scheduleMessages.value = res.data;
    } catch (e: any) {
      const error: NestHttpException = e;
      await useAlert({
        type: ResultTypeEnum.ERROR,
        title: ALERT_TITLE,
        message: error.response?._data || error.message,
      });
    }
  };
  // 예약 메시지 저장
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
      return true;
    } catch (e: any) {
      const error: NestHttpException = e;
      await useAlert({
        type: ResultTypeEnum.ERROR,
        title: ALERT_TITLE,
        message: error.response?._data || error.message,
      });
      return false;
    }
  };
  const asctions = { getScheduleMessages, saveScheduleMessage };

  // ============= Returns =============
  return {
    ...state,
    ...asctions,
  };
});
