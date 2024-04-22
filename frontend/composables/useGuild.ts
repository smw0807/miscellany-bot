import type { DiscordGuildsType } from '~/store/discord';

/**
 * 로컬 스토리지에 길드 정보를 저장하고 불러오는 컴포져블 함수
 * @returns
 */
export default function () {
  return {
    // 길드 정보 저장
    saveGuild(storageName: string, guild: DiscordGuildsType) {
      localStorage.setItem(storageName, JSON.stringify(guild));
    },
    // 길드 정보 불러오기
    loadGuild(storageName: string): DiscordGuildsType {
      return JSON.parse(localStorage.getItem(storageName) || '{}');
    },
  };
}
