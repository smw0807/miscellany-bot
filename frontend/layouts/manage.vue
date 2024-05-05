<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { type DiscordGuildsType } from '~/store/discord';
import Header from '~/components/header.vue';

const config = useRuntimeConfig();
const router = useRouter();

// 서버 정보
const guild: Ref<DiscordGuildsType> = ref({} as DiscordGuildsType);

const isShowNavigationDrawer: Ref<boolean> = ref(false);

onMounted(() => {
  const localStorageGuildData = localStorage.getItem(
    config.public.discordStorageName
  );
  if (localStorageGuildData) {
    guild.value = JSON.parse(localStorageGuildData);
  }
  isShowNavigationDrawer.value = true;
});
</script>
<template>
  <v-layout class="rounded rounded-md">
    <Header />

    <v-navigation-drawer v-if="isShowNavigationDrawer" permanent>
      <v-list density="compact" nav min-width="220">
        <v-list-item
          :prepend-avatar="guild.icon ? guild.icon : ''"
          :title="guild.name"
        ></v-list-item>
        <v-divider />
        <v-list-item
          prepend-icon="mdi-home-city"
          title="채널에 메시지 보내기"
          @click="router.push('/manage/sendMessage')"
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
    </v-navigation-drawer>

    <v-main class="d-flex align-center">
      <v-container>
        <slot />
      </v-container>
    </v-main>
  </v-layout>
</template>
