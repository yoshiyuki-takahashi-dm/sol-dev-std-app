<script setup>
// import
import { ref } from 'vue';
import GamifyButton from '~/components/GamifyButton.vue';
import GamifyDialog from '~/components/GamifyDialog.vue';
import { useDialog } from '#imports'; // 自動補完された#importってなんだ。ビルドしてできた.nuxtの中っぽい。
import { useRuntimeConfig } from '#app'; // アプリランタイム設定取得（nuxt.config.js）。ビルド時ではなく実行時に設定を読むため。

// router
const router = useRouter();
const config = useRuntimeConfig();

// 入力した名前state
const trainerName = ref('');

// 確認ダイアログ　はいボタン押下に対応するイベント
// サーバーエンドAPIをコールする
const onSubmit = async () => {
  console.log("確認ダイアログで はい が押下されました")
  const response = await $fetch("/api/trainer", {
    baseURL: config.public.backendOrigin,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: trainerName.value,
    }),
  }).catch((e) => console.log("SubmitError: " + e));
  if (response instanceof Error) return;

  console.log(`/trainer/${trainerName.value}に遷移します`)
  router.push(`/trainer/${trainerName.value}`);
};

// 確認ダイアログのカスタムフック
const { dialog, onOpen, onClose } = useDialog();

</script>

<template>
  <div>
    <h1>あたらしくはじめる</h1>
    <p>では　はじめに　きみの　なまえを　おしえて　もらおう！</p>
    
    <form @submit.prevent>
      <p>なまえ</p>
      <p>とくていの　もじは　とりのぞかれるぞ！(未実装だぞ)</p>
      <input type="text" v-model="trainerName" placeholder="なまえを入力してください" @keydown.enter="onOpen(true)">
      <GamifyButton @click="onOpen(true)" >けってい</GamifyButton>
    </form>

    <!-- 確認ダイアログ -->
    <!-- onOpen経由でconfirmationDialogの値更新があって画面描画される -->
    <!-- 画面再描画時にconfirmationDialogを見てダイアログ表示有無を切り替える -->
    <!-- dialog以外の名前にするとダイアログ表示されないのはなぜ？TODO：GamifyDialog.vueの中身の理解。 -->
    <GamifyDialog
      v-if="dialog"
      id="confirm-submit"
      title="かくにん"
      :description="`ふむ・・・　きみは　${trainerName}　と　いうんだな！`"
      @close="onClose"
    >
      <GamifyList :border="false" direction="horizon">
        <GamifyItem>
          <GamifyButton @click="onClose">いいえ</GamifyButton>
        </GamifyItem>
        <GamifyItem>
          <GamifyButton @click="onSubmit">はい</GamifyButton>
        </GamifyItem>
      </GamifyList>
    </GamifyDialog>

  </div>
</template>

<style scoped>
form {
  border-radius: 0.5rem;
  border: solid 4px #555;
  padding: 1.5rem 3rem;
}

form > :not(:last-child) {
  display: block;
  margin-bottom: 1rem;
}

.item > label,
.item > span {
  display: block;
  margin-bottom: 0.25rem;
}
.item > span {
  font-size: 0.875rem;
}
</style>
