<script setup lang="ts">
import TimePicker from '~/components/time/TimePicker.vue';
import { EditTypeEnum, RepeatType, ScheduleType } from '~/types/enums';
import type { ChannelType } from '~/store/discordManage';
import type { ScheduleMessageType } from '~/store/discordSchedule';
import dayjs from 'dayjs';
const props = defineProps<{
  open: boolean;
  mode: EditTypeEnum;
  channels: ChannelType[];
  editData?: ScheduleMessageType;
}>();

const emit = defineEmits({
  'input-data': (data: ScheduleMessageType) => true,
  onClose: () => true,
});

// 채널 리스트
const cChannelList = computed(() => props.channels);

const form = ref();
// @everyone 여부
const isEveryone = ref<boolean>(true);
// 사용여부
const isUse = ref<boolean>(true);
// 예약 메시지 전송할 채널
const selectedChannel = ref<ChannelType>();
// 예약 메시지 제목
const title = ref<string>('');
// 예약 메시지 내용
const message = ref<string>('');

// 예약 메시지 타입
const scheduleType = ref<ScheduleType>(ScheduleType.ONETIME);

// 1번 전송 - 예약 메시지 전송 날짜
const sendDateForOnetime = ref<Date>(new Date());
// 1번 전송 - 예약 메시지 전송 시간
const sendTimeForOnetime = ref<string>(dayjs().format('HH:mm'));

// 반복 전송 - 예약 메시지 전송 날짜
const sendDateForRepeat = ref<Date>(new Date());
// 반복 전송 - 시작 시간
const sendTimeForRepeat = ref<string>(dayjs().format('HH:mm'));

// 반복 전송 - 예약 메시지 반복 타입(일, 시, 분)
const repeatType = ref<RepeatType>(RepeatType.MINUTE);
// 반복 전송 - 예약 메시지 반복 주기(일, 시, 분)
const repeatInterval = ref<number>(30);

// 날짜 최소값
const minDate = dayjs().subtract(1, 'day').toDate();

// 초기화
const initializeData = (data: ScheduleMessageType | undefined) => {
  if (data) {
    isEveryone.value = data.isEveryone;
    isUse.value = data.isUse;
    selectedChannel.value = cChannelList.value.find(
      (channel) => channel.id === data.channelId
    );
    title.value = data.title;
    message.value = data.messageContent;
    scheduleType.value = data.scheduleType;
    if (scheduleType.value === ScheduleType.ONETIME) {
      sendDateForOnetime.value = new Date(
        dayjs(data.scheduledAt).format('YYYY-MM-DD')
      );
      sendTimeForOnetime.value = dayjs(data.scheduledAt).format('HH:mm');
    } else {
      sendDateForRepeat.value = new Date(
        dayjs(data.scheduledAt).format('YYYY-MM-DD')
      );
      sendTimeForRepeat.value = dayjs(data.scheduledAt).format('HH:mm');
      repeatType.value = data.repeatType as RepeatType;
      repeatInterval.value = data.repeatInterval as number;
    }
  } else {
    isEveryone.value = true;
    isUse.value = true;
    selectedChannel.value = cChannelList.value[0];
    title.value = '';
    message.value = '';
    scheduleType.value = ScheduleType.ONETIME;
    sendDateForOnetime.value = new Date();
    sendTimeForOnetime.value = dayjs().format('HH:mm');
    sendDateForRepeat.value = new Date();
    sendTimeForRepeat.value = dayjs().format('HH:mm');
    repeatType.value = RepeatType.MINUTE;
    repeatInterval.value = 30;
  }
};

// 데이터 폼 생성
const makeDataForm = (): ScheduleMessageType => {
  if (scheduleType.value === ScheduleType.ONETIME) {
    return oneTimeDataForm();
  }
  return repeatDataForm();
};
// 1회성 데이터
const oneTimeDataForm = (): ScheduleMessageType => {
  return {
    channelId: selectedChannel.value?.id as string,
    title: title.value,
    isEveryone: isEveryone.value,
    isUse: isUse.value,
    messageContent: message.value,
    scheduleType: scheduleType.value,
    scheduledAt: `${dayjs(sendDateForOnetime.value).format('YYYY-MM-DD')} ${
      sendTimeForOnetime.value
    }:00`,
  };
};
// 반복 데이터
const repeatDataForm = (): ScheduleMessageType => {
  return {
    channelId: selectedChannel.value?.id as string,
    title: title.value,
    isEveryone: isEveryone.value,
    isUse: isUse.value,
    messageContent: message.value,
    scheduleType: scheduleType.value,
    scheduledAt: `${dayjs(sendDateForRepeat.value).format('YYYY-MM-DD')} ${
      sendTimeForRepeat.value
    }:00`,
    repeatType: repeatType.value,
    repeatInterval: repeatInterval.value,
  };
};

// 시간 선택 팝업
const timePicker = ref(false);

const emitSave = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;
  emit('input-data', makeDataForm());
};

const rules = {
  channel: [(v: ChannelType) => !!v || '채널을 선택해주세요.'],
  title: [
    (v: string) => !!v || '제목을 입력해주세요.',
    (v: string) => v.length <= 100 || '100자 이하로 입력해주세요.',
  ],
  message: [
    (v: string) => !!v || '메시지를 입력해주세요.',
    (v: string) => v.length <= 1000 || '1000자 이하로 입력해주세요.',
  ],
};

// 반복 주기 타입
const suffixRepeatType = computed(() => {
  switch (repeatType.value) {
    case RepeatType.DAY:
      return '일';
    case RepeatType.HOUR:
      return '시간';
    case RepeatType.MINUTE:
      return '분';
    default:
      return '';
  }
});

// 초기화
watch(
  () => props.open,
  (value) => {
    if (props.mode === EditTypeEnum.ADD) {
      initializeData(undefined);
    }
  }
);
// 수정 데이터
watch(
  () => props.editData,
  (value) => {
    if (value) {
      initializeData(value);
    }
  },
  {
    // 컴포넌트가 처음 렌더링될 때 props.editData가 존재하면 ㅊ포기 데이터를 설정
    immediate: true,
  }
);
</script>
<template>
  <v-sheet>
    <v-dialog v-model="props.open" @close="emit('onClose')" persistent>
      <v-sheet
        class="pa-4 text-center mx-auto"
        elevation="12"
        max-width="600"
        rounded="lg"
        width="100%"
      >
        <h2 class="text-h5 mb-2">
          예약 메시지 {{ props.mode === 'add' ? '추가' : '수정' }}
        </h2>
        <alerts-edit-schedule-message />
        <v-divider class="mt-4" />
        <v-form ref="form">
          <div class="d-flex">
            <!-- @everyone 여부 -->
            <v-checkbox
              v-model="isEveryone"
              label="@everyone 적용"
              hide-details
            ></v-checkbox>
            <v-spacer />
            <!-- 사용여부 -->
            <v-checkbox
              v-model="isUse"
              label="사용여부"
              hide-details
            ></v-checkbox>
          </div>

          <!-- 예약 메시지 전송 채널 -->
          <v-select
            v-model="selectedChannel"
            :items="cChannelList"
            :rules="rules.channel"
            label="예약 메시지 발송할 채널"
            item-title="name"
            item-value="id"
            return-object
          ></v-select>

          <!-- 예약 메시지 제목 -->
          <v-text-field
            v-model="title"
            :rules="rules.title"
            label="예약 메시지 제목"
          ></v-text-field>

          <!-- 예약 메시지 내용 -->
          <v-textarea
            v-model="message"
            :rules="rules.message"
            clear-icon="mdi-close-circle"
            label="채널에 보낼 메시지를 입력해주세요."
            clearable
            counter
            no-resize
          ></v-textarea>

          <!-- 예약 메시지 타입 -->
          <v-radio-group v-model="scheduleType" inline hide-details>
            <v-radio label="1번 전송" :value="ScheduleType.ONETIME"></v-radio>
            <v-radio
              label="반복 전송"
              :value="ScheduleType.RECURRING"
            ></v-radio>
          </v-radio-group>

          <!-- 1번 전송일 때, 보낼 날짜 및 시간 -->
          <template v-if="scheduleType === ScheduleType.ONETIME">
            <v-date-input
              v-model="sendDateForOnetime"
              label="메시지를 전송할 날짜를 선택해주세요."
              :min="minDate"
              :prepend-icon="null"
            ></v-date-input>
            <TimePicker
              v-model="sendTimeForOnetime"
              :open="timePicker"
              label="메시지를 전송할 시간을 선택해주세요."
            />
            <!-- :time="sendTimeForOnetime" -->
          </template>

          <!-- 반복 전송일 때, 시작 날짜 및 시간, 반복주기 -->
          <template v-if="scheduleType === ScheduleType.RECURRING">
            <v-date-input
              v-model="sendDateForRepeat"
              label="반복 메시지가 시작할 날짜를 선택해주세요."
              :min="minDate"
              :prepend-icon="null"
            ></v-date-input>
            <TimePicker
              v-model="sendTimeForRepeat"
              :open="timePicker"
              label="반복 메시지가 시작할 시간을 선택해주세요."
            />
            <v-select
              v-model="repeatType"
              :items="Object.values(RepeatType)"
              label="반복 주기 타입을 선택해주세요."
            ></v-select>
            <v-text-field
              v-model="repeatInterval"
              label="반복 주기를 입력해주세요."
              type="number"
              min="1"
              max="100"
              :suffix="suffixRepeatType"
            ></v-text-field>
          </template>
        </v-form>

        <v-divider class="mb-4"></v-divider>

        <div class="text-end">
          <v-btn
            class="text-none"
            color="primary"
            variant="flat"
            rounded
            @click="emitSave"
            >저장</v-btn
          >
          <v-btn rounded @click="emit('onClose')">닫기</v-btn>
        </div>
      </v-sheet>
    </v-dialog>
  </v-sheet>
</template>
