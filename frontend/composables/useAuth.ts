// 권한 관련 컴포저블 함수 정의 파일

export type DiscordTokenType = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
};
export default function () {
  const config = useRuntimeConfig();
  const accessToken = useCookie(config.public.accessTokenName);
  const refreshToken = useCookie(config.public.refreshTokenName);

  /**
   * 토큰 존재 여부 확인
   * @returns boolean
   */
  const hasToken = (): boolean => {
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
    accessToken.value = data.access_token;
    refreshToken.value = data.refresh_token;
  };

  // 토큰 삭제
  const clearToken = (): void => {
    accessToken.value = '';
    refreshToken.value = '';
  };

  const getAuthorizationHeader = (): Record<string, string> => {
    if (!accessToken.value) {
      return {};
    }
    return {
      Authorization: `Bearer ${accessToken.value}`,
    };
  };

  return {
    hasToken,
    saveToken,
    clearToken,
    getAuthorizationHeader,
  };
}
