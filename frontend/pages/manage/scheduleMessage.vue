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

const totalItems = ref(scheduleStore.total);
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
  await scheduleStore.getScheduleMessages();
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

//### 테이블 관련 ###
// 선택 로우
const selectedSchedule = ref<string[]>([]);
// 헤더
const headers = [
  { text: '제목', value: 'title' },
  { text: '예약 유형', value: 'scheduleType' },
  { text: '예약 시간', value: 'scheduleTime' },
  { text: '내용', value: 'scheduleTime' },
  { text: '반복 예약 시간', value: 'scheduleTime' },
  { text: '반복 간격', value: 'scheduleTime' },
  { text: '반복 유형', value: 'scheduleTime' },
  { text: '전송 여부', value: 'isSend' },
  { text: '등록일', value: 'createdAt' },
];
onMounted(async () => {
  scheduleStore.guildId = loadGuild().id;
  if (channelList.value.length === 0) {
    channelList.value = await getChannelList();
  }
  await scheduleStore.getScheduleMessages();
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
    <v-card-text>
      <v-data-table
        v-model="selectedSchedule"
        :headers="headers"
        :items="items"
        :items-length="totalItems"
        @click:row="rowClickEvent"
        show-select
        items-per-page="10"
        density="comfortable"
        hide-default-footer
        no-data-text="등록된 트리거 메시지가 없습니다."
      >
        <template #item.message="{ item }">
          {{
            item.message.length > 10
              ? item.message.slice(0, 10) + '...'
              : item.message
          }}
        </template>
      </v-data-table>
      <v-pagination
        v-model="page"
        :length="Math.ceil(totalItems / 10)"
        rounded
        color="primary"
        @update:model-value="pageUpdate"
        class="my-4"
      ></v-pagination>
    </v-card-text>
  </v-card>

  <EditSchedule
    @onClose="closeDialog"
    @input-data="onInputData"
    :open="openEditScheduleDialog"
    :mode="editMode"
    :channels="cChannels"
  />
</template>
