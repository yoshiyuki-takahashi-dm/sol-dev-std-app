<script setup>
import { useRoute } from 'vue-router';
import CatchButton from '~/components/CatchButton.vue';

const route = useRoute();
const config = useRuntimeConfig();

const trainerName = route.params.name; // パスパラメータからnameを取得
const {data: trainer} = await useFetch(
  () => `/api/trainer/${trainerName}`,
  {
    default: () => [],
    server: false,
    baseUrl: config.public.backendOrigin,
  },
);
console.log("Trainer Pokemons: " + trainer.pokemons);
</script>

<template>
  <div>
    <!-- タイトル　トレーナー名表示 -->
    <h1>やあ {{ trainerName }} ！　ぼうけん　を　はじめよう</h1>

    <!-- アバター画像 -->
    <div>
      <img src="/avatar.png" alt="Avatar" class="trainer-img">
    </div>

    <!-- トレーナー削除ボタン -->
    <GamifyButton >マサラタウンにかえる（未実装）</GamifyButton>

    <!-- てもちぽけもん タイトル-->
    <h1>てもちポケモン</h1>

    <!-- ぽけもんげっとボタン -->
     <!-- パスパラメータからトレーナー名（name）を取得して、続くcatchページに遷移する -->
      <CatchButton :to="`/trainer/${route.params.name}/catch`">
        ポケモンをつかまえる
      </CatchButton>

    <!-- てもちぽけもん リスト-->
    <GamifyList>
      <GamifyItem v-for="pokemon in trainer.pokemons" :key="pokemon.id">
        <img :src="pokemon.sprites" alt="ポケモンフロント画像">
        <span>{{pokemon.name}}</span>
      </GamifyItem>
    </GamifyList>


  </div>
</template>

<style scoped>
</style>