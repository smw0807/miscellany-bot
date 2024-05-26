export type ChannelType = {
  id: string;
  name: string;
  type: string;
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

  const actions = {
    requestChannels,
  };

  // ============= Return =============
  return {
    ...state,
    ...actions,
  };
});
