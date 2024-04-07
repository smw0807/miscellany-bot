//디스코드 API URL
const API_URL = 'https://discord.com/api';

export enum DISOCRD_API_NAME {
  GUILDS = 'GUILDS',
  USER = 'USER',
  OAUTH2_TOKEN = 'OAUTH2_TOKEN',
}

//디스코드 API URL 리스트
export const DISCORD_API_URL = {
  // 유저 길드 리스트
  GUILDS: `${API_URL}/users/@me/guilds`,
  // 유저 정보(본인-email)
  USER: `${API_URL}/users/@me`,
  // 기본 인증 URL (디스코드 로그인)
  OAUTH2_AUTHORIZE: `${API_URL}/oauth2/authorize`,
  // Access Token 요청
  OAUTH2_TOKEN: `${API_URL}/oauth2/token`,
};
