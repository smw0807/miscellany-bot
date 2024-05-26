// 디스코드 메시지 관련 스토어
import { ResultTypeEnum } from '~/types/enums';
import type { NestHttpException } from '~/types/errors';
export type SendMessageType = {
  guildId: string;
  channelId: string;
  message: string;
  isEveryone: boolean;
};

export const useDiscordMessagesStore = defineStore('discordMessages', () => {
  const { useAlert, useConfirm } = useDialog();
  // ============= State =============
  const state = {};

  // ============= Actions =============
  // 채널로 메시지 보내기
  const sendMessage = async (params: SendMessageType): Promise<boolean> => {
    try {
      const confirm = await useConfirm({
        type: ResultTypeEnum.INFO,
        title: '메시지 전송',
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
        title: '메시지 전송 성공',
        message: res,
      });
      return true;
    } catch (e: any) {
      const error: NestHttpException = e;
      await useAlert({
        type: ResultTypeEnum.ERROR,
        title: '메시지 전송 실패',
        message: error.response?._data || error.message,
      });
      return false;
    }
  };
  const actions = {
    sendMessage,
  };

  // ============= Return =============
  return {
    ...state,
    ...actions,
  };
});
