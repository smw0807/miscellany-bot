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
    ): Promise<void> => {
      try {
        const res = await $fetch('/api/discord/trigger-message', {
          method: 'POST',
          params,
        });
        console.log('res : ', res);
      } catch (e) {
        // const error: NestHttpException = e;
        console.error(e);
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
