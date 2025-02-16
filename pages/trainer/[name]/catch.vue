<script setup>
const route = useRoute(); // 現在のルート情報にアクセスするためのフック
const router = useRouter(); // ルーターを使うためのフック
const config = useRuntimeConfig();

// ポケモンリスト
var data = null;
var pokemons = null;
var pokemonsWithDetailsList = ref([]);
var types = null;

// ローディング中かどうか
const loading = ref(true);

// エラーがあったかどうか
const error = ref(null);

// ポケモン一覧取得時のオフセット
const offset = 0;

// ポケモン一覧取得時のリミット
// 指定しないと20になって少ないので、10000に設定
// TODO：ユーザー操作でフィルタかけるようにする。100体超える場合は「多いから減らせ」的なメッセージを表示する
// TODO：1000件ちょっとの詳細情報を取得する時間がかかるから、初回起動時に裏で持っておきたい
const limit = 10;

// ポケモン一覧取得
try {
    data = await useFetch(
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

}
catch (err) {
    error.value = err;
}
// 
finally {
    loading.value = false;

    // ただ取得しただけの一覧
    pokemons = data.data;

    // 型チェック
    console.log('useFetch返却値.resultsは' + typeof pokemons.value.results + 'です');

    // pokemonsはリアクティブじゃないのにvalueプロパティを介すのはなぜだろう
    console.log(pokemons.value.results);

    // // // ポケモン名だけを取り出せるか確認用
    // pokemons.value.results.forEach((pokemon) => {
    //     console.log(pokemon.name);
    // });

    if (pokemons == null) {
        console.log("ポケモンデータ取得できませんでした");
    } else {
        console.log("Pokemons: " + pokemons);
    }
}

const getPokemonDetails = async () => {
    // ポケモン詳細情報取得
    try {
        // // 各ポケモンの詳細情報を取得して追加
    console.log("各ポケモンの詳細情報を取得して追加")
    for (const pokemonResult of pokemons.value.results) {
        console.log("URL: " + pokemonResult.url);
        // ポケモンの詳細情報取得
        const response = await fetch(
                // URL
                pokemonResult.url,
        )
        const detail = await response.json();
        console.log("単純fetchのresponseをjson変換したもの: " + detail);
        types = detail.types;
        console.log("タイプは " + types);
        pokemonsWithDetailsList.value.push({
            ...pokemonResult,
            types,
        });
    }

    console.log("詳細情報: " + pokemonsWithDetailsList.value);
    }
    catch (err) {
        error.value = err;
    }finally {
    }
}
</script>

<template>
    <div>
        <h1>ポケモンをつかまえる画面だよ</h1>
        <h2>次やること：ポケモン画像</h2>
        <h3>{{ pokemons.count }} しゅるいのポケモン</h3>
        <div v-if="loading">読み込み中...</div>
        <div v-else-if="error">エラーが発生しました: {{ error.message }}</div>

        <!-- ポケモン詳細情報を取得するボタン -->
        <GamifyButton @click="getPokemonDetails()">詳細情報を取得</GamifyButton>

        <h2>詳細情報を追加したポケモン一覧　確認用</h2>
        <ul>
            <li v-for="(pokemonWithDetails, id) in pokemonsWithDetailsList" :key="id">
                {{ pokemonWithDetails }}
            </li>
        </ul>
        
        <h2>ポケモン一覧</h2>
        <GamifyList>
            <li v-for="(pokemonWithDetails, id) in pokemonsWithDetailsList" :key="id">
                {{ pokemonWithDetails.name }}
                <GamifyButton>つかまえる</GamifyButton>
            </li>
        </GamifyList>

    </div>
</template>

<style scoped></style>