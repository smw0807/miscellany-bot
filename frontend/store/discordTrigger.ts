import dayjs from 'dayjs';
import { ResultTypeEnum } from '~/types/enums';
import type { NestHttpException } from '~/types/errors';
// 트리거 메시지 타입
export type TriggerMessageType = {
  guildId?: string;
  triggerWord: string;
  message: string;
  isEveryone: boolean;
  isUse: boolean;
};
// 트리거 메시지 데이터 타입
export type TriggerMessagesDataType = {
  id: string;
  createdAt: string;
  updatedAt: string;
} & TriggerMessageType;
// 트리거 메시지 목록 조회 응답 타입
export type TriggerMessagesListResponseType = {
  data: TriggerMessagesDataType[];
  total: number;
};
export const useDiscordMessagesTriggerStore = defineStore(
  'discordMessagesTrigger',
  () => {
    const { useAlert, useConfirm } = useDialog();
    const ALERT_TITLE = '트리거 메시지';
    // ============= State =============
    const guildId = ref<string>(''); // 길드 아이디
    const pageIndex = ref<number>(1); // 페이지 인덱스
    const pageSize = ref<number>(10); // 페이지 사이즈
    const total = ref<number>(0); // 전체 데이터 수
    const triggerMessages = ref<TriggerMessagesDataType[]>([]); // 트리거 메시지
    const state = {
      guildId,
      pageIndex,
      pageSize,
      total,
      triggerMessages,
    };

    // ============= Actions =============
    // 트리거 메시지 목록 조회
    const getTriggerMessages = async (): Promise<void> => {
      try {
        const res = await $fetch<TriggerMessagesListResponseType>(
          '/api/trigger/messages',
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
        triggerMessages.value = res.data.map((item) => ({
          ...item,
          createdAt: dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss'),
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
    // 트리거 메시지 등록
    const addTriggerMessage = async (
      params: TriggerMessageType
    ): Promise<boolean> => {
      try {
        const res = await $fetch<string>('/api/trigger/message', {
          method: 'POST',
          params,
        });
        await useAlert({
          type: ResultTypeEnum.SUCCESS,
          title: ALERT_TITLE,
          message: res,
        });
        await getTriggerMessages();
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
    // 트리거 메시지 수정
    const updateTriggerMessage = async (
      id: string,
      params: TriggerMessageType
    ): Promise<boolean> => {
      try {
        const res = await $fetch<string>(`/api/trigger/message/${id}`, {
          method: 'PATCH',
          params,
        });
        await useAlert({
          type: ResultTypeEnum.SUCCESS,
          title: ALERT_TITLE,
          message: res,
        });
        await getTriggerMessages();
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

    // 트리거 메시지 삭제
    const deleteTriggerMessage = async (id: string[]): Promise<void> => {
      try {
        const confirm = await useConfirm({
          type: ResultTypeEnum.WARNING,
          title: ALERT_TITLE,
          message:
            id.length === 1
              ? '선택된 트리거를 정말 삭제하시겠습니까?'
              : '선택한 트리거들을 정말 삭제하시겠습니까?',
        });
        if (!confirm) return;
        const res = await $fetch('/api/trigger/message', {
          method: 'DELETE',
          params: { id },
        });
        await useAlert({
          type: ResultTypeEnum.SUCCESS,
          title: ALERT_TITLE,
          message: res as string,
        });
        await getTriggerMessages();
      } catch (e: any) {
        const error: NestHttpException = e;
        await useAlert({
          type: ResultTypeEnum.ERROR,
          title: ALERT_TITLE,
          message: error.response?._data || error.message,
        });
      }
    };
    const actions = {
      getTriggerMessages,
      addTriggerMessage,
      updateTriggerMessage,
      deleteTriggerMessage,
    };

    // ============= Return =============
    return {
      ...state,
      ...actions,
    };
  }
);
