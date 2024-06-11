import { ref } from 'vue';
import { ResultTypeEnum } from '~/types/enums';

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
  const { useAlert } = useDialog();
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
      console.error(e.response);
      await useAlert({
        type: ResultTypeEnum.ERROR,
        title: '서버 정보 조회 실패',
        message:
          '서버에 문제가 있을 수 있습니다.<br/>잠시 후 다시 시도해주세요.',
      });
    }
  };

  const actions = {
    requestGuilds,
  };

  // ============= Return =============
  return {
    ...state,
    ...getters,
    ...actions,
  };
});
