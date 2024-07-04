<script setup lang="ts">
import { EditTypeEnum, ResultTypeEnum } from '~/types/enums';
import type { ChannelType } from '~/store/discordManage';
import type { ScheduleMessageType } from '~/store/discordSchedule';
import EditSchedule from '~/components/dialog/EditSchedule.vue';
import { useDiscordScheduleStore } from '~/store/discordSchedule';
definePageMeta({
  layout: 'manage',
});

const scheduleStore = useDiscordScheduleStore();
const { getChannelList, loadGuild } = useGuild();
const { useConfirm } = useDialog();

// 채널 리스트
const channelList = ref<ChannelType[]>([]);
const cChannels = computed(() => channelList.value);

const totalItems = ref(0);
// 예약 메시지 다이얼로그 오픈
const openEditScheduleDialog = ref(false);
// 예약 메시지 다이얼로그 모드
const editMode = ref<EditTypeEnum>(EditTypeEnum.ADD);
// 예약 메시지 저장
const onInputData = async (mode: EditTypeEnum, data: ScheduleMessageType) => {
  const TITLE =
    mode === EditTypeEnum.ADD ? '예약 메시지 추가' : '예약 메시지 수정';
  const CONFIRM_MESSAGE =
    mode === EditTypeEnum.ADD
      ? '예약 메시지를 추가하시겠습니까?'
      : '예약 메시지를 수정하시겠습니까?';
  const confirm = await useConfirm({
    type: ResultTypeEnum.INFO,
    title: TITLE,
    message: CONFIRM_MESSAGE,
  });
  if (!confirm) return;
  const dataForm = { ...data };
  dataForm.guildId = loadGuild().id;
  const result = await scheduleStore.saveScheduleMessage(dataForm);
  if (result) closeDialog();
};
// 예약 메시지 다이얼로그 열기
const openDialog = () => {
  editMode.value = EditTypeEnum.ADD;
  openEditScheduleDialog.value = true;
};
// 예약 메시지 다이얼로그 닫기
const closeDialog = () => {
  openEditScheduleDialog.value = false;
};
onMounted(async () => {
  if (channelList.value.length === 0) {
    channelList.value = await getChannelList();
  }
});
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
    @input-data="onInputData"
    :open="openEditScheduleDialog"
    :mode="editMode"
    :channels="cChannels"
  />
</template>
