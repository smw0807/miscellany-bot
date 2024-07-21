<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { type DiscordGuildsType } from '~/store/discord';
import Header from '~/components/header.vue';
import Alert from '~/components/dialog/Alert.vue';
import Confirm from '~/components/dialog/Confirm.vue';
import { useDiscordManageStore } from '~/store/discordManage';

const config = useRuntimeConfig();
const router = useRouter();
const discordManageStore = useDiscordManageStore();

// 서버 정보
const guild: Ref<DiscordGuildsType> = ref({} as DiscordGuildsType);

onMounted(async () => {
  const localStorageGuildData = localStorage.getItem(
    config.public.discordStorageName
  );

  if (!localStorageGuildData) {
    router.push('/');
    return;
  }
  guild.value = JSON.parse(localStorageGuildData);
  // 채널 리스트 요청
  if (discordManageStore.channelList.length === 0) {
    await discordManageStore.requestChannels(guild.value.id);
  }
});

onUnmounted(() => {
  // 채널 리스트 초기화
  discordManageStore.channelList = [];
});
</script>
<template>
  <v-layout class="rounded rounded-md">
    <Header />

    <v-navigation-drawer permanent>
      <v-list density="compact" nav min-width="220">
        <v-list-item
          :prepend-avatar="guild.icon ? guild.icon : ''"
          @click="router.push('/manage')"
        >
          <div class="text-h6">{{ guild.name }}</div>
        </v-list-item>
        <v-divider />
        <v-list-item
          prepend-icon="mdi-home-city"
          title="채널에 메시지 보내기"
          @click="router.push('/manage/sendMessage')"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-account-group-outline"
          title="트리거 메시지 관리"
          @click="router.push('/manage/triggerMessage')"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-account"
          title="예약 메시지 관리"
          @click="router.push('/manage/scheduleMessage')"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="d-flex align-center">
      <v-container>
        <Alert />
        <Confirm />
        <slot />
      </v-container>
    </v-main>
  </v-layout>
</template>
