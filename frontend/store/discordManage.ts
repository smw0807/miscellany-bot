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
      console.log('requestChannels111', res);
      channelList.value = res;
    } catch (e: any) {
      console.error(e);
    }
  };

  // 채널로 메시지 보내기
  // todo channel.send를 못찾는다고 떠서 해결되어야 완성 가능
  const sendMessage = async (params: SendMessageType): Promise<boolean> => {
    try {
      const res = await $fetch('/api/discord/send-message', {
        method: 'POST',
        body: JSON.stringify(params),
      });
      console.log('res : ', res);
      return true;
    } catch (e: any) {
      console.error(e);
      return false;
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
