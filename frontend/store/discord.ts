import { ref } from 'vue';

export type DiscordGuildsType = {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
  features: string[];
  hasBot?: boolean;
};

export const useDiscordStore = defineStore('discord', () => {
  // ============= State =============
  // 서버 목록
  const guilds = ref<DiscordGuildsType[]>([]);
  const state = {
    guilds,
  };

  // ============= Getters =============
  const getters = {};

  // ============= Actions =============
  // 사용자가 관리중인 서버 목록 가져오기
  const requestGuilds = async (): Promise<void> => {
    try {
      const config = useRuntimeConfig();
      const token = useCookie(config.public.accessTokenName);

      const result: DiscordGuildsType[] = await $fetch('/api/discord/guilds', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
      guilds.value = result;
    } catch (e: any) {
      // 401 에러일 경우 로그인 페이지로
      if (e.response.status === 401) {
        const token = useAuth();
        token.clearToken();
        const router = useRouter();
        router.replace('/login');
      }
    }
  };
  // 채널로 메시지 보내기
  const sendMessage = async (
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
    requestGuilds,
    sendMessage,
  };

  // ============= Return =============
  return {
    ...state,
    ...getters,
    ...actions,
  };
});
