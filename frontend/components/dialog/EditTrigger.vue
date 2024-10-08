<script setup lang="ts">
import type { TriggerMessageType } from '~/store/discordTrigger';
import { ResultTypeEnum } from '~/types/enums';
import { EditTypeEnum } from '~/types/enums';

const props = withDefaults(
  defineProps<{
    open: boolean;
    mode?: EditTypeEnum;
    editData?: TriggerMessageType;
  }>(),
  {
    open: false,
    mode: EditTypeEnum.ADD,
  }
);

const { useConfirm } = useDialog();

const emit = defineEmits({
  'input-data': (mode: EditTypeEnum, data: TriggerMessageType) => true,
  onClose: () => true,
});

const form = ref();
// @everyone 여부
const isEveryone: Ref<boolean> = ref(true);
// 사용여부
const isUse: Ref<boolean> = ref(true);
// 트리거할 단어
const triggerWord: Ref<string> = ref('');
// 유효성검사
const triggerWordRules = [
  (v: string) => !!v || '트리거할 단어를 입력해주세요.',
  (v: string) => v.match(/\s/) === null || '공백은 입력할 수 없습니다.',
];
// 발송할 메시지
const message: Ref<string> = ref('');
// 유효성검사
const messageRules = [
  (v: string) => !!v || '메시지를 입력해주세요.',
  (v: string) => v.length <= 1000 || '1000자 이하로 입력해주세요.',
];
// 저장
const emitSave = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;
  const confirm = await useConfirm({
    type: ResultTypeEnum.INFO,
    title: props.mode === EditTypeEnum.ADD ? '트리거 추가' : '트리거 수정',
    message:
      props.mode === EditTypeEnum.ADD
        ? '트리거를 추가하시겠습니까?'
        : '트리거를 수정하시겠습니까?',
  });
  if (confirm) {
    const dataForm: Ref<TriggerMessageType> = ref({
      isEveryone: isEveryone.value,
      isUse: isUse.value,
      triggerWord: triggerWord.value.startsWith('!')
        ? triggerWord.value
        : `!${triggerWord.value}`,
      message: message.value,
    });
    emit('input-data', props.mode, dataForm.value);
  }
};

const initializeData = (data: TriggerMessageType | undefined) => {
  if (data) {
    isEveryone.value = data.isEveryone;
    isUse.value = data.isUse;
    triggerWord.value = data.triggerWord.replace('!', '');
    message.value = data.message;
  } else {
    isEveryone.value = true;
    isUse.value = true;
    triggerWord.value = '';
    message.value = '';
  }
};

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
    //컴포넌트가 처음 렌더링될 때 props.editData가 존재하면 초기 데이터를 설정
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
          트리거 {{ props.mode === 'add' ? '추가' : '수정' }}
        </h2>
        <alerts-edit-trigger-message />
        <v-form ref="form">
          <div class="d-flex">
            <!-- @everyon 여부 -->
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

          <!-- 트리거할 단어 입력  -->
          <v-text-field
            v-model="triggerWord"
            :rules="triggerWordRules"
            label="트리거할 단어"
            outlined
            placeholder="트리거할 단어를 입력해주세요."
            required
            prefix="!"
          />

          <!-- 발송할 메시지 입력 -->
          <v-textarea
            v-model="message"
            :rules="messageRules"
            clear-icon="mdi-close-circle"
            label="채널에 보낼 메시지를 입력해주세요."
            clearable
            counter
            no-resize
          ></v-textarea>
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
