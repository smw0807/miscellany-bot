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
  const sendMessage = async (params: SendMessageType): Promise<string> => {
    try {
      const res = await $fetch<string>('/api/discord/send-message', {
        method: 'POST',
        body: JSON.stringify(params),
      });
      return res;
    } catch (e: any) {
      console.error(e);
      return '메시지 전송에 실패했습니다.';
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
