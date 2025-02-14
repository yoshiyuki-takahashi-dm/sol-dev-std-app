<script setup>
const route = useRoute(); // 現在のルート情報にアクセスするためのフック
const router = useRouter(); // ルーターを使うためのフック
const config = useRuntimeConfig();

// ポケモンリスト
const pokemons = ref([]);

// ローディング中かどうか
const loading = ref(true);

// エラーがあったかどうか
const error = ref(null);

// ポケモン一覧取得時のオフセット
const offset = 0;

// ポケモン一覧取得時のリミット
// 指定しないと20になって少ないので、10000に設定
// TODO：ユーザー操作でフィルタかけるようにする。100体超える場合は「多いから減らせ」的なメッセージを表示する
const limit = 10000;

// ポケモン一覧取得
try {
    const { data } = await useFetch(
        () =>
            // ポケモン一覧取得API. offsetとlimitで取得範囲を指定
            `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`,
        {
            default: () => [],
            // false: リクエストをクライアントサイドのみで行う
            // true: サーバーサイドレンダリング時にもリクエストを行う
            server: false,
        },
    );
    pokemons.value = data;
} catch (err) {
    error.value = err;
} finally {
    loading.value = false;
    if (pokemons == null) {
        console.log("ポケモンデータ取得できませんでした");
    } else {
        console.log("Pokemons: " + pokemons.value);
    }
}

</script>

<template>
    <div>
        <h1>ポケモンをつかまえる画面だよ</h1>
        <div v-if="loading">読み込み中...</div>
        <div v-else-if="error">エラーが発生しました: {{ error.message }}</div>

        <h4>{{pokemons}}</h4>
    </div>
</template>

<style scoped></style>