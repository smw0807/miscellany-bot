<script setup lang="ts">
import { useDiscordStore } from '~/store/discord';
import Header from '~/components/header.vue';

const router = useRouter();

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
  console.warn('로그인이 필요합니다.');
  router.push('/login');
}
</script>
<template>
  <v-layout class="rounded rounded-md">
    <Header />
    <v-main class="d-flex align-center">
      <slot />
    </v-main>
  </v-layout>
</template>
