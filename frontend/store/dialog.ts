export type AlertDialogType = {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  btnText?: string;
  // onConfirm: () => void;
};
export type ConfirmDialogType = {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  okText?: string;
  cancelText?: string;
  // onConfirm: () => void;
};
export const useDialogStore = defineStore('dialog', () => {
  let alertResolver: ((value?: unknown) => void) | null = null;
  let confirmResolver: ((value: boolean) => void) | null = null;

  // ============= State =============
  const alertDialog = ref<AlertDialogType | null>(null);
  const confirmDialog = ref<ConfirmDialogType | null>(null);
  const state = { alertDialog, confirmDialog };

  // ============= Actions =============
  const showAlert = (data: AlertDialogType) => {
    alertDialog.value = data;
    return new Promise((resolver) => {
      alertResolver = resolver;
    });
  };
  const closeAlert = () => {
    alertDialog.value = null;
    if (alertResolver) {
      alertResolver();
      alertResolver = null;
    }
  };

  const showConfirm = (data: ConfirmDialogType) => {
    confirmDialog.value = data;
    return new Promise<boolean>((resolver) => {
      confirmResolver = resolver;
    });
  };
  const closeConfirm = (confirmed: boolean) => {
    confirmDialog.value = null;
    if (confirmResolver) {
      confirmResolver(confirmed);
      confirmResolver = null;
    }
  };
  const actions = { showAlert, closeAlert, showConfirm, closeConfirm };

  // ============= Return =============
  return {
    ...state,
    ...actions,
  };
});
