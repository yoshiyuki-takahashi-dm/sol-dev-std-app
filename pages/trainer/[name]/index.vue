<script setup>
import { useRoute } from 'vue-router';
import CatchButton from '~/components/CatchButton.vue';

const route = useRoute(); // 現在のルート情報にアクセスするためのフック
const router = useRouter(); // ルーターを使うためのフック
const config = useRuntimeConfig();

const trainerName = route.params.name; // パスパラメータからnameを取得
const { data: trainer } = await useFetch(
  () => `/api/trainer/${trainerName}`,
  {
    default: () => [],
    server: false,
    baseUrl: config.public.backendOrigin,
  },
);
// ダイアログのカスタムフック
const { dialog, onOpen, onClose } = useDialog();

// ぽけもんをつかまえる
// フロントでポケモン情報を取得しておいて、bodyにつめて、バックエンドにポストする
const onByebye = async (pokemonName) => {
  console.log("pokemon Byebye開始");

  // ぽけもん取得
  // ポケモンの詳細情報取得
  const responsePokemon = await fetch(
    // URL
    `https://pokeapi.co/api/v2/pokemon/${pokemonName}`,
  )
  const responsePokemonJson = await responsePokemon.json();

  console.log("ぽけもんの名前指定で取得した情報: " + responsePokemonJson);

  // 必要な情報だけピックアップする
  const {
    name,
  } = responsePokemonJson;

  // ポケモンを削除してトレーナー情報を更新する
  const response = await $fetch(`/api/trainer/${trainerName}/pokemon/delete`, {
    baseURL: config.public.backendOrigin,
    method: "POST",
    body: {
      pokemon: {
        "name": name,
      },
    },
  }).catch((e) => e);
  if (response instanceof Error) return;

  console.log("ぽけもんByebye 結果" + response)

  // 問題なくS3に保存できればダイアログを閉じて画面再描画する
  onClose();
};
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
    <GamifyButton>マサラタウンにかえる（未実装）</GamifyButton>

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
        <span>{{ pokemon.name }}</span>
        <GamifyButton @click="onOpen(pokemon.name)">オーキド博士おくり</GamifyButton>
      </GamifyItem>
    </GamifyList>


    <!-- 確認ダイアログ -->
    <GamifyDialog v-if="dialog" id="confirm-catch" title="かくにん" :description="`${dialog}　を　オーキド博士に　おくるんじゃな？`"
      @close="onClose">
      <GamifyList :border="false" direction="horizon">
        <GamifyItem>
          <GamifyButton @click="onClose">いいえ</GamifyButton>
        </GamifyItem>
        <GamifyItem>
          <GamifyButton @click="onByebye(dialog)">はい</GamifyButton>
        </GamifyItem>
      </GamifyList>
    </GamifyDialog>


  </div>
</template>

<style scoped></style>