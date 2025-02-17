// ポケモンタイプ選択ダイアログ　カスタムフック
export default () => {
  const typeColorDialog = ref(null);
  const onTypeColorDialogOpen = () => {
    console.log("ポケモンタイプ選択ダイアログを開きます")
    typeColorDialog.value = "hoge";
  };
  const onTypeColorDialogClose = () => {
    console.log("ポケモンタイプ選択ダイアログを閉じます")
    typeColorDialog.value = null;
  };
  return {
    typeColorDialog,
    onTypeColorDialogOpen,
    onTypeColorDialogClose,
  };
};
