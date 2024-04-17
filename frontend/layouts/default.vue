<script setup lang="ts">
import { useDiscordStore, type DiscordGuildsType } from '~/store/discord';

const config = useRuntimeConfig();
const projectName: Ref<string> = ref(config.public.projectName);

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
  <v-layout class="rounded rounded-md">
    <v-app-bar>
      <v-avatar class="mx-3">
        <v-img src="/logo.png" alt="logo" />
      </v-avatar>
      <span class="text-h5">{{ projectName }}</span>
    </v-app-bar>

    <v-main class="d-flex align-center justify-center">
      <slot />
    </v-main>
  </v-layout>
</template>
