<script setup lang="ts">
import useGuild from '~/composables/useGuild';
import { useAuthStore } from '~/store/auth';
import { useDiscordStore, type DiscordGuildsType } from '~/store/discord';

const router = useRouter();
const { saveGuild, clearGuild, hasGuild } = useGuild();

const discordStore = useDiscordStore();
const authStore = useAuthStore();

// 디스코드 봇 설치 URL 요청
const requestInstallURL = async () => {
  const installUrl = await authStore.discordInstallUrl();
  if (installUrl) window.open(installUrl, '_blank');
};
// 관리중인 서버 목록
const cGuilds = computed<DiscordGuildsType[]>(() => discordStore.guilds);

// 관리 페이지로 이동
const moveAdminPage = (guild: DiscordGuildsType) => {
  // 서버 정보를 localStorage에 저장, 스토어는 새로고침 시 사라지기 때문에 로컬스토리지를 쓰는게 좋을 것 같음.
  saveGuild(guild);
  // 관리 페이지로 이동
  router.push('/manage');
};
onMounted(() => {
  // 메인페이지에서 길드 정보가 남아 있으면 초기화
  if (hasGuild()) {
    clearGuild();
  }
});
</script>
<template>
  <v-container>
    <v-row align="center" dense>
      <v-col col="6" v-for="(guild, idx) in cGuilds">
        <v-card
          class="mx-auto"
          :subtitle="guild.hasBot ? '봇 추가됨' : '봇 추가 필요'"
          :title="guild.name"
        >
          <template v-slot:prepend>
            <v-avatar v-if="guild.icon" size="60">
              <v-img :alt="guild.icon" :src="guild.icon"></v-img>
            </v-avatar>
            <v-avatar v-else size="60" color="blue-darken-2"></v-avatar>
          </template>
          <v-card-text class="text-right">
            <v-btn
              v-if="!guild.hasBot"
              class="me-2 text-none"
              color="blue-darken-4"
              prepend-icon="mdi-plus-thick"
              variant="flat"
              @click="requestInstallURL"
            >
              봇 추가
            </v-btn>
            <v-btn
              v-else
              class="me-2 text-none"
              color="red-accent-2"
              prepend-icon="mdi-lock-open"
              variant="flat"
              @click="moveAdminPage(guild)"
            >
              관리
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
