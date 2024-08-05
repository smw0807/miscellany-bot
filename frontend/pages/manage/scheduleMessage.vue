<script setup lang="ts">
import {
  EditTypeEnum,
  ResultTypeEnum,
  ScheduleType,
  SendStatus,
} from '~/types/enums';
import type { ChannelType } from '~/store/discordManage';
import type { ScheduleMessageType } from '~/store/discordSchedule';
import EditSchedule from '~/components/dialog/EditSchedule.vue';
import { useDiscordScheduleStore } from '~/store/discordSchedule';
definePageMeta({
  layout: 'manage',
});

const TITLE = computed(() => {
  if (editMode.value === EditTypeEnum.ADD) return '예약 메시지 추가';
  if (editMode.value === EditTypeEnum.EDIT) return '예약 메시지 수정';
  return '예약 메시지 추가';
});
const CONFIRM_MESSAGE = computed(() => {
  if (editMode.value === EditTypeEnum.ADD)
    return '예약 메시지를 추가하시겠습니까?';
  if (editMode.value === EditTypeEnum.EDIT)
    return '예약 메시지를 수정하시겠습니까?';
  return '예약 메시지를 추가하시겠습니까?';
});

const scheduleStore = useDiscordScheduleStore();
const { getChannelList, loadGuild } = useGuild();
const { useConfirm } = useDialog();

// 채널 리스트
const channelList = ref<ChannelType[]>([]);
const cChannels = computed(() => channelList.value);

const totalItems = computed(() => scheduleStore.total);
// 예약 메시지 다이얼로그 오픈
const openEditScheduleDialog = ref(false);
// 예약 메시지 다이얼로그 모드
const editMode = ref<EditTypeEnum>(EditTypeEnum.ADD);
// 예약 메시지 처리
const onInputData = async (data: ScheduleMessageType) => {
  const confirm = await useConfirm({
    type: ResultTypeEnum.INFO,
    title: TITLE.value,
    message: CONFIRM_MESSAGE.value,
  });
  if (!confirm) return;
  const dataForm = { ...data };
  dataForm.guildId = loadGuild().id;
  await processData(dataForm);
};
// 예약 메시지 저장
const processData = async (dataForm: ScheduleMessageType) => {
  let result = false;
  if (editMode.value === EditTypeEnum.ADD) {
    result = await scheduleStore.saveScheduleMessage(dataForm);
  } else if (editMode.value === EditTypeEnum.EDIT) {
    result = await scheduleStore.updateScheduleMessage(
      rowItem.value?.id!,
      dataForm
    );
  } else {
    console.error('예약 메시지 처리 오류');
    return;
  }
  if (result) closeDialog();
  await scheduleStore.getScheduleMessages();
};
// 예약 메시지 삭제
const deleteSchedule = async () => {
  const result = await scheduleStore.deleteScheduleMessage(
    selectedSchedule.value
  );
  if (result) await scheduleStore.getScheduleMessages();
  selectedSchedule.value = [];
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
// 선택 로우 아이템
const rowItem = ref<ScheduleMessageType>();
// 헤더
const headers = [
  { title: '제목', value: 'title' },
  { title: '내용', value: 'messageContent' },
  { title: '예약 유형', value: 'scheduleType' },
  { title: '예약 시간', value: 'scheduledAt' },
  { title: '마지막 전송 시간', value: 'lastSentAt' },
  { title: '전송 여부', value: 'sendStatus' },
];
// 예약 유형 한글 표기
const scheduleType = (type: ScheduleType) => {
  switch (type) {
    case ScheduleType.ONETIME:
      return '단일';
    case ScheduleType.RECURRING:
      return '반복';
    default:
      return '알 수 없음';
  }
};
// 데이터
const items = computed(() => scheduleStore.scheduleMessages);
// row 클릭 이벤트
const rowClickEvent = (
  _event: Event,
  { item }: { item: ScheduleMessageType }
) => {
  rowItem.value = item;
  editMode.value = EditTypeEnum.EDIT;
  openEditScheduleDialog.value = true;
};
// 현재 페이지
const page = computed(() => scheduleStore.pageIndex);
// 페이지 이벤트
const pageUpdate = (value: number) => {
  console.log(value);
  scheduleStore.pageIndex = value;
  scheduleStore.getScheduleMessages();
};

onMounted(async () => {
  scheduleStore.guildId = loadGuild().id;
  if (channelList.value.length === 0) {
    channelList.value = await getChannelList();
  }
  scheduleStore.getScheduleMessages();
});
</script>
<template>
  <v-card>
    <v-card-title> 예약 메시지 관리 </v-card-title>
    <v-card-text>
      <alerts-schedule-message />
      <div class="text-right mt-3">
        <v-btn color="warning" @click="openDialog"> 예약 메시지 추가 </v-btn>
        <v-btn
          :disabled="selectedSchedule.length === 0"
          color="red"
          @click="deleteSchedule"
          class="ml-1"
        >
          예약 메시지 삭제
        </v-btn>
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
        no-data-text="등록된 예약 메시지가 없습니다."
      >
        <template #item.scheduleType="{ item }">
          <v-chip
            v-if="item.scheduleType === ScheduleType.ONETIME"
            color="#1E88E5"
          >
            {{ scheduleType(item.scheduleType) }}
          </v-chip>
          <v-chip
            v-else-if="item.scheduleType === ScheduleType.RECURRING"
            color="#43A047"
          >
            {{ scheduleType(item.scheduleType) }}
          </v-chip>
          <v-chip v-else variant="flat" color="#757575">
            {{ scheduleType(item.scheduleType) }}
          </v-chip>
        </template>

        <template #item.messageContent="{ item }">
          {{
            item.messageContent.length > 10
              ? item.messageContent.slice(0, 10) + '...'
              : item.messageContent
          }}
        </template>
        <template #item.sendStatus="{ item }">
          <v-chip
            v-if="item.sendStatus === SendStatus.SUCCESS"
            color="primary"
            text-color="white"
            variant="flat"
          >
            전송 완료
          </v-chip>
          <v-chip
            v-else-if="item.sendStatus === SendStatus.FAIL"
            color="red"
            text-color="white"
            variant="flat"
          >
            전송 실패
          </v-chip>
          <v-chip v-else color="green" text-color="white" variant="flat">
            전송 대기
          </v-chip>
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
    :edit-data="rowItem"
  />
</template>
