export const useAuthStore = defineStore('auth', () => {
  // ============= State =============
  const state = {};

  // ============= Getters =============
  const getters = {};

  // ============= Actions =============
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
        headers: {
          'Content-Type': 'application/json',
        },
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
    discordLogin,
    discordToken,
  };

  return {
    ...state,
    ...getters,
    ...actions,
  };
});
