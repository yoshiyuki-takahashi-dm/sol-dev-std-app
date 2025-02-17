// トレーナー名入力の確認ダイアログ　カスタムフック
export default () => {
  const typeColorDialog = ref(null);
  const onTypeColorDialogOpen = () => {
    console.log("確認ダイアログを開きます")
    typeColorDialog.value = "hoge";
  };
  const onTypeColorDialogClose = () => {
    console.log("確認ダイアログを閉じます")
    typeColorDialog.value = null;
  };
  return {
    typeColorDialog,
    onTypeColorDialogOpen,
    onTypeColorDialogClose,
  };
};
