<script setup lang="ts">
import { useDialogStore } from '~/store/dialog';
import DialogIcon from './Icon/DialogIcon.vue';
const store = useDialogStore();
const isShow = computed(() => !!store.alertDialog);
const confirm = () => {
  store.closeAlert();
};
const alertData = computed(() => store.alertDialog);
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
        <dialog-icon :type="alertData?.type!" size="60"></dialog-icon>

        <h2 class="text-h5 mb-2">{{ alertData?.title ?? '' }}</h2>

        <pre
          v-if="alertData?.message"
          v-html="alertData?.message ?? ''"
          class="mb-4 text-medium-emphasis text-body-1"
        ></pre>

        <v-divider class="mb-4"></v-divider>

        <div class="text-end">
          <v-btn
            class="text-none"
            :color="alertData?.type"
            variant="flat"
            width="90"
            rounded
            @click="confirm"
          >
            {{ alertData?.btnText ?? '확인' }}
          </v-btn>
        </div>
      </v-sheet>
    </v-dialog>
  </v-sheet>
</template>
