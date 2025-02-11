// オフライン時などAPIが機能しないときに使うデモモード　カスタムフック
export default () => {
  // デフォルトはデモモードではない
  const _isDemo = ref(false);
  const onStartDemo = (value) => {
    console.log("デモモードを開始します")
    _isDemo.value = value;
  };
  const onEndDemo = (value) => {
    console.log("デモモードを終了します")
    _isDemo.value = value;
  };
  return {
    isDemo: _isDemo,
    onStartDemo: onStartDemo,
    onEndDemo: onEndDemo,
  };
};
