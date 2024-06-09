import { ResultTypeEnum } from '~/types/enums';
export type AlertDialogType = {
  type: ResultTypeEnum;
  title: string;
  message?: string;
  btnText?: string;
  // onConfirm: () => void;
};
export type ConfirmDialogType = {
  type: ResultTypeEnum;
  title: string;
  message?: string;
  okText?: string;
  cancelText?: string;
  // onConfirm: () => void;
};
export const useDialogStore = defineStore('dialog', () => {
  let alertResolve: ((value?: unknown) => void) | null = null;
  let confirmResolve: ((value: boolean) => void) | null = null;

  // ============= State =============
  const alertDialog = ref<AlertDialogType | null>(null);
  const confirmDialog = ref<ConfirmDialogType | null>(null);
  const state = { alertDialog, confirmDialog };

  // ============= Actions =============
  const showAlert = (data: AlertDialogType) => {
    alertDialog.value = data;
    return new Promise((resolver) => {
      alertResolve = resolver;
    });
  };
  const closeAlert = () => {
    alertDialog.value = null;
    if (alertResolve) {
      alertResolve();
      alertResolve = null;
    }
  };

  const showConfirm = (data: ConfirmDialogType) => {
    confirmDialog.value = data;
    return new Promise<boolean>((resolver) => {
      confirmResolve = resolver;
    });
  };
  const closeConfirm = (confirmed: boolean) => {
    confirmDialog.value = null;
    if (confirmResolve) {
      confirmResolve(confirmed);
      confirmResolve = null;
    }
  };
  const actions = { showAlert, closeAlert, showConfirm, closeConfirm };

  // ============= Return =============
  return {
    ...state,
    ...actions,
  };
});
