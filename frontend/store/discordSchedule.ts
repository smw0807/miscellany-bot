import dayjs from 'dayjs';
import {
  ResultTypeEnum,
  type RepeatType,
  type ScheduleType,
} from '~/types/enums';
import type { NestHttpException } from '~/types/errors';

// 예약 메시지 데이터 타입
export type ScheduleMessageType = {
  id?: string;
  guildId?: string;
  channelId: string;
  isEveryone: boolean;
  title: string;
  messageContent: string;
  scheduleType: ScheduleType;
  scheduledAt?: string;
  repeatInterval?: number;
  repeatType?: RepeatType;
  createdAt?: string;
  updatedAt?: string;
  isSend?: boolean;
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
        '/api/schedule/messages',
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
      scheduleMessages.value = res.data.map((item) => ({
        ...item,
        scheduledAt: dayjs(item.scheduledAt).format('YYYY-MM-DD HH:mm'),
        createdAt: dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: dayjs(item.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
        lastSentAt: item.lastSentAt
          ? dayjs(item.lastSentAt).format('YYYY-MM-DD HH:mm:ss')
          : '',
      }));
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
      const res = await $fetch<string>('/api/schedule/message', {
        method: 'POST',
        params,
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
  // 예약 메시지 수정
  const updateScheduleMessage = async (
    id: string,
    params: ScheduleMessageType
  ) => {
    try {
      const res = await $fetch<string>(`/api/schedule/message/${id}`, {
        method: 'PATCH',
        params,
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
  const actions = {
    getScheduleMessages,
    saveScheduleMessage,
    updateScheduleMessage,
  };

  // ============= Returns =============
  return {
    ...state,
    ...actions,
  };
});
