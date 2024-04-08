// 권한 관련 컴포저블 함수 정의 파일

export type DiscordTokenType = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
};
export default function () {
  /**
   * 토큰 존재 여부 확인
   * @returns boolean
   */
  const hasToken = (): boolean => {
    const config = useRuntimeConfig();
    const accessToken = useCookie(config.public.accessTokenName);
    const refreshToken = useCookie(config.public.refreshTokenName);
    if (!accessToken.value || !refreshToken.value) {
      return false;
    }
    return true;
  };

  /**
   * 토큰 저장
   * @param data
   */
  const saveToken = (data: DiscordTokenType): void => {
    const config = useRuntimeConfig();
    const accessToken = useCookie(config.public.accessTokenName);
    const refreshToken = useCookie(config.public.refreshTokenName);
    accessToken.value = data.access_token;
    refreshToken.value = data.refresh_token;
  };

  return {
    hasToken,
    saveToken,
  };
}
