<script setup lang="ts">
import { onMounted } from 'vue';
import { useDiscordStore, type DiscordGuildsType } from '~/store/discord';

const discordStore = useDiscordStore();

// 관리중인 서버 목록 조회 요청
const getGuilds = async () => {
  await discordStore.requestGuilds();
};
// 관리중인 서버 목록
const cGuilds = computed<DiscordGuildsType[]>(() => discordStore.guilds);

onMounted(async () => {
  if (discordStore.guilds.length === 0) {
    await getGuilds();
  }
});
</script>
<template>
  <v-col> {{ cGuilds }}</v-col>
</template>
