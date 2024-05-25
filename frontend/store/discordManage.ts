import { ResultTypeEnum } from '~/types/enums';

export type ChannelType = {
  id: string;
  name: string;
  type: string;
};
export type SendMessageType = {
  guildId: string;
  channelId: string;
  message: string;
  isEveryone: boolean;
};

export const useDiscordManageStore = defineStore('discordManage', () => {
  const { useAlert, useConfirm } = useDialog();
  // ============= State =============
  //서버에 있는 채널 목록
  const channelList = ref<ChannelType[]>([]);
  const state = { channelList };

  // ============= Actions =============
  // 채널 목록 가져오기
  const requestChannels = async (guildId: string): Promise<void> => {
    try {
      const res = await $fetch<ChannelType[]>('/api/discord/channels', {
        method: 'GET',
        query: {
          guildId,
        },
      });
      channelList.value = res;
    } catch (e: any) {
      console.error(e);
    }
  };

  // 채널로 메시지 보내기
  const sendMessage = async (params: SendMessageType): Promise<void> => {
    try {
      const result = await useConfirm({
        type: ResultTypeEnum.INFO,
        title: '메시지 전송',
        message: '메시지를 전송하시겠습니까?',
        okText: '전송',
        cancelText: '취소',
      });
      if (!result) return;

      const res = await $fetch<string>('/api/discord/send-message', {
        method: 'POST',
        body: JSON.stringify(params),
      });
      await useAlert({
        type: ResultTypeEnum.SUCCESS,
        title: '메시지 전송 성공',
        message: res,
      });
    } catch (e: any) {
      console.error(e);
      await useAlert({
        type: ResultTypeEnum.ERROR,
        title: '메시지 전송 실패',
        message: e.message,
      });
    }
  };
  const actions = {
    sendMessage,
    requestChannels,
  };

  // ============= Return =============
  return {
    ...state,
    ...actions,
  };
});
