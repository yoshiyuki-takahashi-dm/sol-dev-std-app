<script setup>
import { useRoute } from 'vue-router';
import CatchButton from '~/components/CatchButton.vue';

const route = useRoute(); // 現在のルート情報にアクセスするためのフック
const router = useRouter(); // ルーターを使うためのフック
const config = useRuntimeConfig();

// トレーナー情報 リアクティブ変数にして更新して画面描画できるようにする
const trainer = ref(null);

const trainerName = route.params.name; // パスパラメータからnameを取得
const fetchTrainerData = async () => {
  const { data } = await useFetch(
    () => `/api/trainer/${trainerName}`,
    {
      default: () => [],
      server: false,
      baseUrl: config.public.backendOrigin,
    },
  );
  trainer.value = data;
}
// トレーナー情報取得
// awaitにしておかないと画面描画時にデータが取得される前に画面が描画されてしまう
await fetchTrainerData();

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

  // 問題なくS3に保存できてここに到達したらダイアログを閉じて画面再描画する
  // Question: dialog.valueをnullにしてリアクティブ変数に変更があったのに画面再描画されないのはなぜ？
  onClose();
  // トレーナー情報を再取得することで関連するポケモンリストのコンポーネントを再描画する
  await fetchTrainerData();
};

const onGoBackPalletTown = async () => {
  console.log("マサラタウンにかえる");

  // ポケモンを削除してトレーナー情報を更新する
  const response = await $fetch(`/api/trainer/${trainerName}/delete`, {
    baseURL: config.public.backendOrigin,
    method: "POST",
    body: {
    },
  }).catch((e) => e);
  if (response instanceof Error) return;

  // 問題なくS3に保存できてここに到達したらホーム画面に戻る
  console.log(trainerName + "は マサラタウン に かえりました");
  router.push("/");
}
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
    <GamifyButton @click="onGoBackPalletTown()">マサラタウンにかえる</GamifyButton>

    <!-- てもちぽけもん タイトル-->
    <h1>てもちポケモン</h1>

    <!-- ぽけもんげっとボタン -->
    <!-- パスパラメータからトレーナー名（name）を取得して、続くcatchページに遷移する -->
    <CatchButton :to="`/trainer/${route.params.name}/catch`">
      ポケモンをつかまえる
    </CatchButton>

    <!-- てもちぽけもん リスト-->
    <GamifyList>
      <GamifyItem v-for="pokemon in trainer.value.pokemons" :key="pokemon.id">
        <img :src="pokemon.sprites" alt="ポケモンフロント画像">
        <span class="pokemon-name">{{ pokemon.name }}</span>
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