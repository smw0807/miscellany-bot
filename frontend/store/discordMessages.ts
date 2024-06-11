// 디스코드 메시지 관련 스토어
import { ResultTypeEnum } from '~/types/enums';
import dayjs from 'dayjs';
import type { NestHttpException } from '~/types/errors';
export type SendMessageType = {
  guildId: string;
  channelId: string;
  message: string;
  isEveryone: boolean;
};

// 메시지 전송 내역 타입
export type SendMessagesHistoryType = {
  id: string;
  channelId: string;
  channelName: string;
  guildId: string;
  guildName: string;
  isEveryone: boolean;
  message: string;
  createdAt: string;
  updatedAt: string;
  userId?: string | null;
};

// 메시지 전송 내역 조회 응답 타입
export type SendMessagesHistoryResponseType = {
  data: SendMessagesHistoryType[];
  total: number;
};

export const useDiscordMessagesStore = defineStore('discordMessages', () => {
  const { useAlert, useConfirm } = useDialog();
  const ALERT_SEND_TITLE = '디스코드 메시지 전송';
  const ALERT_HISTORY_TITLE = '디스코드 메시지 전송 내역';
  // ============= State =============
  const guildId = ref<string>(''); // 길드 아이디
  const pageIndex = ref<number>(1); // 페이지 인덱스
  const pageSize = ref<number>(10); // 페이지 사이즈
  const total = ref<number>(0); // 전체 데이터 수
  const sendMessagesHistory = ref<SendMessagesHistoryType[]>([]); // 메시지 전송 내역
  const state = {
    guildId,
    pageIndex,
    pageSize,
    total,
    sendMessagesHistory,
  };

  // ============= Actions =============
  // 채널로 메시지 보내기
  const sendMessage = async (params: SendMessageType): Promise<boolean> => {
    try {
      const confirm = await useConfirm({
        type: ResultTypeEnum.INFO,
        title: ALERT_SEND_TITLE,
        message: '메시지를 전송하시겠습니까?',
        okText: '전송',
        cancelText: '취소',
      });
      if (!confirm) return false;

      const res = await $fetch<string>('/api/discord/send-message', {
        method: 'POST',
        body: JSON.stringify(params),
      });
      await useAlert({
        type: ResultTypeEnum.SUCCESS,
        title: ALERT_SEND_TITLE,
        message: res,
      });
      await findSendMessageHistory();
      return true;
    } catch (e: any) {
      const error: NestHttpException = e;
      console.log(error.response?._data);
      await useAlert({
        type: ResultTypeEnum.ERROR,
        title: ALERT_SEND_TITLE,
        message: error.response?._data,
      });
      return false;
    }
  };

  // 채널 메시지 전송 내역 조회
  const findSendMessageHistory = async (): Promise<void> => {
    try {
      const res = await $fetch<SendMessagesHistoryResponseType>(
        '/api/discord/send-message-history',
        {
          method: 'GET',
          query: {
            guildId: guildId.value,
            pageSize: pageSize.value,
            pageIndex: pageIndex.value - 1,
          },
        }
      );
      if (res.total !== 0) {
        total.value = res.total;
        sendMessagesHistory.value = res.data.map((item) => ({
          ...item,
          createdAt: dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        }));
      }
    } catch (e: any) {
      const error: NestHttpException = e;
      await useAlert({
        type: ResultTypeEnum.ERROR,
        title: ALERT_HISTORY_TITLE,
        message: error.response?._data || error.message,
      });
    }
  };
  const actions = {
    sendMessage,
    findSendMessageHistory,
  };

  // ============= Return =============
  return {
    ...state,
    ...actions,
  };
});
