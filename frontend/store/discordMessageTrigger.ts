import { ResultTypeEnum } from '~/types/enums';
import type { NestHttpException } from '~/types/errors';

export type TriggerMessageType = {
  guildId?: string;
  triggerWord: string;
  message: string;
  isEveryone: boolean;
};
export const useDiscordMessagesTriggerStore = defineStore(
  'discordMessagesTrigger',
  () => {
    const { useAlert, useConfirm } = useDialog();
    // ============= State =============

    const state = {};

    // ============= Actions =============
    // 트리거 메시지 목록 조회
    // 트리거 메시지 등록
    const addTriggerMessage = async (
      params: TriggerMessageType
    ): Promise<boolean> => {
      try {
        const res = await $fetch<string>('/api/supabase/trigger-message', {
          method: 'POST',
          body: JSON.stringify(params),
        });
        await useAlert({
          type: ResultTypeEnum.SUCCESS,
          title: '트리거 메시지 등록',
          message: res,
        });
        return true;
      } catch (e: any) {
        const error: NestHttpException = e;
        await useAlert({
          type: ResultTypeEnum.ERROR,
          title: '트리거 메시지 등록 실패',
          message: error.response?._data || error.message,
        });
        return false;
      }
    };
    // 트리거 메시지 수정

    // 트리거 메시지 삭제
    const actions = { addTriggerMessage };

    // ============= Return =============
    return {
      ...state,
      ...actions,
    };
  }
);
