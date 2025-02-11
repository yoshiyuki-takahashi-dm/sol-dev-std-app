// オフライン時などAPIが機能しないときに使うデモモード　カスタムフック
export default () => {
  // デフォルトはデモモードではない
  const _isDemo = ref(false);
  const onStartDemo = () => {
    console.log("デモモードを開始します")
    _isDemo.value = true;
  };
  const onEndDemo = () => {
    console.log("デモモードを終了します")
    _isDemo.value = false;
  };
  return {
    isDemo: _isDemo,
    onStartDemo: onStartDemo,
    onEndDemo: onEndDemo,
  };
};
