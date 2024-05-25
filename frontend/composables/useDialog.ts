import { useDialogStore, type ConfirmDialogType } from '~/store/dialog';
import { type AlertDialogType } from '~/store/dialog';
export default function () {
  const dialogStore = useDialogStore();
  // alert dialog
  const useAlert = (data: AlertDialogType) => {
    return dialogStore.showAlert(data);
  };
  // confirm dialog
  const useConfirm = (data: ConfirmDialogType) => {
    return dialogStore.showConfirm(data);
  };

  return {
    useAlert,
    useConfirm,
  };
}
