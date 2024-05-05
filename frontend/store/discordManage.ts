export const useDiscordManageStore = defineStore('discordManage', () => {
  // ============= State =============
  const state = {};

  // ============= Getters =============
  const getters = {};

  // ============= Actions =============
  // 채널로 메시지 보내기
  // todo channel.send를 못찾는다고 떠서 해결되어야 완성 가능
  const sendMessage = async (
    guildId: string,
    channelId: string,
    message: string,
    isEveryone: boolean = false
  ): Promise<boolean> => {
    try {
      const config = useRuntimeConfig();
      const token = useCookie(config.public.accessTokenName);

      await $fetch('/api/discord/send-message', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
        query: {
          guildId,
          channelId,
          message,
          isEveryone,
        },
      });
      return true;
    } catch (e: any) {
      console.error(e);
      return false;
    }
  };
  const actions = {
    sendMessage,
  };

  // ============= Return =============
  return {
    ...state,
    ...getters,
    ...actions,
  };
});
