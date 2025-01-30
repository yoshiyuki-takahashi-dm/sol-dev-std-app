// トレーナー名入力の確認ダイアログ　カスタムフック
export default () => {
  const dialog = ref(null);
  const onOpen = (value) => {
    console.log("確認ダイアログを開きます")
    dialog.value = value;
  };
  const onClose = () => {
    console.log("確認ダイアログを閉じます")
    dialog.value = null;
  };
  return {
    dialog,
    onOpen,
    onClose,
  };
};
