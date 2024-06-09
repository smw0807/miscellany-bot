<script setup lang="ts">
import { useDialogStore } from '~/store/dialog';
import DialogIcon from './Icon/DialogIcon.vue';
const store = useDialogStore();
const isShow = computed(() => !!store.confirmDialog);
const confirm = (result: boolean) => {
  store.closeConfirm(result);
};
const confirmData = computed(() => store.confirmDialog);
</script>
<template>
  <v-sheet>
    <v-dialog v-model="isShow" max-width="400" persistent>
      <v-sheet
        class="pa-4 text-center mx-auto"
        elevation="12"
        max-width="600"
        rounded="lg"
        width="100%"
      >
        <dialog-icon :type="confirmData?.type!" size="60"></dialog-icon>

        <h2 class="text-h5 mb-2">{{ confirmData?.title ?? '' }}</h2>

        <pre
          v-if="confirmData?.message"
          v-html="confirmData?.message ?? ''"
          class="mb-4 text-medium-emphasis text-body-1"
        ></pre>

        <v-divider class="mb-4"></v-divider>

        <div class="text-end">
          <v-btn
            class="text-none"
            :color="confirmData?.type"
            variant="flat"
            width="90"
            rounded
            @click="confirm(true)"
          >
            {{ confirmData?.okText ?? '확인' }}
          </v-btn>
          <v-btn
            class="text-none"
            variant="flat"
            width="90"
            rounded
            @click="confirm(false)"
          >
            {{ confirmData?.cancelText ?? '취소' }}
          </v-btn>
        </div>
      </v-sheet>
    </v-dialog>
  </v-sheet>
</template>
