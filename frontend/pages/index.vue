<script setup lang="ts">
import { useDiscordStore, type DiscordGuildsType } from '~/store/discord';

const discordStore = useDiscordStore();

// 관리중인 서버 목록
const cGuilds = computed<DiscordGuildsType[]>(() => discordStore.guilds);
</script>
<template>
  <v-col> {{ cGuilds }}</v-col>
</template>
