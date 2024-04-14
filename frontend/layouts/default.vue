<script setup lang="ts">
import { useDiscordStore, type DiscordGuildsType } from '~/store/discord';

const { hasToken } = useAuth();
if (hasToken()) {
  const discordStore = useDiscordStore();
  // 관리중인 서버 목록 조회 요청
  const getGuilds = async () => {
    await discordStore.requestGuilds();
  };

  onMounted(async () => {
    if (discordStore.guilds.length === 0) {
      await getGuilds();
    }
  });
} else {
  // 토큰이 없을 경우 로그인 페이지로 이동
  const router = useRouter();
  console.warn('로그인이 필요합니다.');
  router.push('/login');
}
</script>
<template>
  <slot />
</template>
