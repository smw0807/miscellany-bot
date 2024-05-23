export type AlertDialogType = {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  btnText?: string;
  onConfirm: () => void;
};
export type ConfirmDialogType = {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  okText?: string;
  cancelText?: string;
  onConfirm: () => void;
};
export const useDialogStore = defineStore('dialog', () => {
  // ============= State =============
  const alertDialog = ref<AlertDialogType | null>(null);
  const confirmDialog = ref<ConfirmDialogType | null>(null);
  const state = { alertDialog, confirmDialog };

  // ============= Actions =============

  const actions = {};

  // ============= Return =============
  return {
    ...state,
    ...actions,
  };
});
