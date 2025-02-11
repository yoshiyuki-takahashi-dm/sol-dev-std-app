<script setup>
import { useRoute } from 'vue-router';

const router = useRoute();
const trainer = router.params.name; // パスパラメータからnameを取得
console.log("Trainer: " + trainer);
</script>

<template>
  <div>
    <h1>やあ {{ trainer }} ！　ぼうけん　を　はじめよう</h1>
    <!-- ここにトレーナーごとのコンテンツを追加 -->
  </div>
</template>

<style scoped>
</style>