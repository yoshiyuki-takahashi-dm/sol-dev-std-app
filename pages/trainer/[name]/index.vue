<script setup>
import { useRoute } from 'vue-router';
import CatchButton from '~/components/CatchButton.vue';

const router = useRoute();
const trainer = router.params.name; // パスパラメータからnameを取得
console.log("Trainer: " + trainer);
</script>

<template>
  <div>
    <!-- タイトル　トレーナー名表示 -->
    <h1>やあ {{ trainer }} ！　ぼうけん　を　はじめよう</h1>

    <!-- アバター画像 -->
    <div>
      <img src="/avatar.png" alt="Avatar" class="trainer-img">
    </div>

    <!-- トレーナー削除ボタン -->
    <GamifyButton >マサラタウンにかえる（未実装）</GamifyButton>

    <!-- てもちぽけもん タイトル-->
    <h1>てもちポケモン</h1>

    <!-- ぽけもんげっとボタン -->
      <CatchButton :to="`/trainer/${router.params.name}/catch`">
        ポケモンをつかまえる
      </CatchButton>

    <!-- てもちぽけもん リスト-->
    <GamifyList>
      <!-- <GamifyItem v-for="trainer in trainers" :key="trainer">
        <NuxtLink :to="`/trainer/${trainer}`">{{ trainer }}</NuxtLink>
      </GamifyItem> -->
    </GamifyList>


  </div>
</template>

<style scoped>
</style>