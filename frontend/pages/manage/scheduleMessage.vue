<script setup lang="ts">
import { EditTypeEnum } from '~/types/enums';
import { useDiscordManageStore } from '~/store/discordManage';
import type { ChannelType } from '~/store/discordManage';
import EditSchedule from '~/components/dialog/EditSchedule.vue';
definePageMeta({
  layout: 'manage',
});

// 디스코드 관리 스토어
const discordManageStore = useDiscordManageStore();
// 채널 리스트
const cChannels = computed<ChannelType[]>(() => discordManageStore.channelList);

const totalItems = ref(0);
// 예약 메시지 다이얼로그 오픈
const openEditScheduleDialog = ref(false);
// 예약 메시지 다이얼로그 모드
const editMode = ref<EditTypeEnum>(EditTypeEnum.ADD);
// 예약 메시지 다이얼로그 열기
const openDialog = () => {
  editMode.value = EditTypeEnum.ADD;
  openEditScheduleDialog.value = true;
};
// 예약 메시지 다이얼로그 닫기
const closeDialog = () => {
  openEditScheduleDialog.value = false;
};
</script>
<template>
  <v-card>
    <v-card-title> 예약 메시지 관리 </v-card-title>
    <v-card-text>
      <alerts-schedule-message />
      <div class="text-right mt-3">
        <v-btn color="warning" @click="openDialog"> 예약 메시지 추가 </v-btn>
        <v-btn color="red" class="ml-1"> 예약 메시지 삭제</v-btn>
      </div>
    </v-card-text>

    <v-card-title class="d-flex">
      <span>등록된 예약 메시지</span>
      <v-spacer />
      <div class="text-subtitle-1 text-">총 {{ totalItems }} 개</div>
    </v-card-title>
  </v-card>

  <EditSchedule
    @onClose="closeDialog"
    :open="openEditScheduleDialog"
    :mode="editMode"
    :channels="cChannels"
  />
</template>
