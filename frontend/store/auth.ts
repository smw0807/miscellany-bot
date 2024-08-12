import { ResultTypeEnum } from '~/types/enums';

export const useAuthStore = defineStore('auth', () => {
  const { useAlert } = useDialog();
  // ============= State =============
  const state = {};

  // ============= Getters =============
  const getters = {};

  // ============= Actions =============
  // 디스코드 설치 URL 가져오기
  const discordInstallUrl = async (): Promise<string> => {
    try {
      const result = await $fetch<string>('/api/auth/discord/install');
      return result;
    } catch (e) {
      console.error(e);
      useAlert({
        type: ResultTypeEnum.ERROR,
        title: '봇 추가 실패',
        message: '봇 추가 URL을 가져오는데 실패했습니다.',
      });
      return '';
    }
  };
  // 디스코드 로그인 URL 가져오기
  const discordLogin = async (): Promise<string> => {
    try {
      const result = await $fetch<string>('/api/auth/discord/login');
      return result;
    } catch (e) {
      throw 'Failed to login with discord';
    }
  };
  // 디스코드 로그인 후 토큰 요청
  const discordToken = async (
    code: string,
    state: string
  ): Promise<DiscordTokenType> => {
    try {
      const result = await $fetch<DiscordTokenType>('/api/auth/discord/token', {
        method: 'POST',
        params: {
          code,
          state,
        },
      });
      return result;
    } catch (e) {
      throw 'Failed to get token with discord';
    }
  };
  const actions = {
    discordInstallUrl,
    discordLogin,
    discordToken,
  };

  return {
    ...state,
    ...getters,
    ...actions,
  };
});
