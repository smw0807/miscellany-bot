<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { type DiscordGuildsType } from '~/store/discord';

const config = useRuntimeConfig();

// 서버 정보
const guild: Ref<DiscordGuildsType> = ref({} as DiscordGuildsType);

onMounted(() => {
  const localStorageGuildData = localStorage.getItem(
    config.public.discordStorageName
  );
  if (localStorageGuildData) {
    guild.value = JSON.parse(localStorageGuildData);
  }
});
</script>
<template>
  <v-list density="compact" nav min-width="220">
    <v-list-item
      :prepend-avatar="guild.icon ? guild.icon : ''"
      :title="guild.name"
    ></v-list-item>
    <v-divider />
    <v-list-item
      prepend-icon="mdi-home-city"
      title="서버에 메시지 보내기"
    ></v-list-item>
    <v-list-item
      prepend-icon="mdi-account"
      title="예약 메시지 관리"
    ></v-list-item>
    <v-list-item
      prepend-icon="mdi-account-group-outline"
      title="메시지 트리거 관리"
    ></v-list-item>
  </v-list>
</template>
\
