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
    } catch (e) {
      console.error(e);
    }
  };
  const actions = {
    requestGuilds,
  };

  return {
    ...state,
    ...getters,
    ...actions,
  };
});
