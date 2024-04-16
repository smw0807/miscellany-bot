<script setup lang="ts">
import { useDiscordStore, type DiscordGuildsType } from '~/store/discord';

const discordStore = useDiscordStore();

// 관리중인 서버 목록
const cGuilds = computed<DiscordGuildsType[]>(() => discordStore.guilds);
</script>
<template>
  <v-container>
    <v-row align="center" dense>
      <v-col cols="6" md="3" v-for="(guild, idx) in cGuilds">
        <v-card
          class="mx-auto"
          :subtitle="guild.hasBot ? '봇 추가됨' : '봇 추가 필요'"
          :title="guild.name"
        >
          <template v-slot:prepend>
            <v-avatar v-if="guild.icon">
              <v-img :alt="guild.icon" :src="guild.icon"></v-img>
            </v-avatar>
            <v-avatar v-else color="blue-darken-2"></v-avatar>
          </template>
          <v-card-text
            >TODO:봇 추가 버튼 또는 관리자 페이지 이동 버튼</v-card-text
          >
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
