import type { DiscordGuildsType } from '~/store/discord';
import { useDiscordManageStore } from '~/store/discordManage';
import type { ChannelType } from '~/store/discordManage';

/**
 * 로컬 스토리지에 길드 정보를 저장하고 불러오는 컴포져블 함수
 * @returns
 */
export default function () {
  const config = useRuntimeConfig();
  const manageStore = useDiscordManageStore();

  // 서버에 있는 채널 목록
  const channelList = computed<ChannelType[]>(() => manageStore.channelList);
  // 로컬 스토리지 이름
  const storageName = config.public.discordStorageName;

  return {
    // 길드 정보 저장
    saveGuild(guild: DiscordGuildsType) {
      localStorage.setItem(storageName, JSON.stringify(guild));
    },
    // 길드 정보 불러오기
    loadGuild(): DiscordGuildsType {
      return JSON.parse(localStorage.getItem(storageName) || '{}');
    },
    // 길드 정보 삭제
    clearGuild(): void {
      localStorage.removeItem(storageName);
    },
    // 길드 정보 존재 여부
    hasGuild(): boolean {
      return !!localStorage.getItem(storageName);
    },
    // 채널 목록
    async getChannelList(): Promise<ChannelType[]> {
      if (channelList.value.length === 0) {
        const guild = JSON.parse(localStorage.getItem(storageName) || '{}');
        await manageStore.requestChannels(guild.id);
      }
      return channelList.value;
    },
  };
}
