//디스코드 API에 필요한 타입 정의 파일

const API_URL = 'https://discord.com/api/v10';

//디스코드 API URL 리스트
export const DISCORD_API_URL = {
  // 기본 인증 URL (디스코드 로그인)
  OAUTH2_AUTHORIZE: `${API_URL}/oauth2/authorize`,
  // Access Token 요청
  OAUTH2_TOKEN: `${API_URL}/oauth2/token`,
  // 유저 길드 리스트
  GUILDS: `${API_URL}/users/@me/guilds`,
  // 유저 정보(본인-email)
  USER: `${API_URL}/users/@me`,
  // 서버 채널 리스트
  GUILD_CHANNELS: `${API_URL}/guilds/:guildId/channels`,
};

// 디스코드 API grant_type
export enum DISCORD_GRANT_TYPE {
  AUTHORIZATION_CODE = 'authorization_code',
  CLIENT_CREDENTIALS = 'client_credentials',
  ACCESS_TOKEN = 'access_token',
  REFRESH_TOKEN = 'refresh_token',
}
/**
 * GUILDS
 * https://discord.com/developers/docs/activities/building-an-activity#step-7-use-the-api-to-fetch-the-guild
 */
