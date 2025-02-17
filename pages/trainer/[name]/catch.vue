<script setup>
import useTypeColorDialogDialog from '~/composables/useTypeColorDialog.js';
import TypeColorWheel from '~/components/TypeColorWheel.vue';

const route = useRoute(); // 現在のルート情報にアクセスするためのフック
const router = useRouter(); // ルーターを使うためのフック
const config = useRuntimeConfig();

// ポケモンリスト
var data = null;
var pokemons = null;
var pokemonsWithDetailsList = ref([]);
var types = null;
var pokemonFrontDefaultImg = null;
var pokemonBackDefaultImg = null;
var pokemonsWithDetailsListLength = ref(0);
var isExistPokemonDetails = ref(false);

// ローディング中かどうか
const loading = ref(true);

// エラーがあったかどうか
const error = ref(null);

// ポケモン一覧取得時のオフセット
const offset = 0;

// ポケモン一覧取得時のリミット
// 指定しないと20になって少ないので、10000に設定
// TODO：ユーザー操作でフィルタかけるようにする。100体超える場合は「多いから減らせ」的なメッセージを表示する
const limit = 100;

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

    var tmpInitialList = [];
    for (const pokemonResult of pokemons.value.results) {
        // 一覧情報と詳細情報を結合してtmpリストに追加
        tmpInitialList.push({
            ...pokemonResult,
        });
    }
    // ポケモン詳細情報リストを更新
    pokemonsWithDetailsList.value = tmpInitialList;

    if (pokemons == null) {
        console.log("ポケモンデータ取得できませんでした");
    } else {
        console.log("Pokemons: " + pokemons);
    }
}

// ダイアログのカスタムフック
const { dialog, onOpen, onClose } = useDialog();

// タイプ選択ダイアログのカスタムフック
const { typeColorDialog, onTypeColorDialogOpen, onTypeColorDialogClose } = useTypeColorDialogDialog();

const getPokemonDetails = async () => {
    // 更新前にクリア
    pokemonsWithDetailsList.value = [];

    // ポケモン詳細情報取得
    try {
        // 各ポケモンの詳細情報を取得して追加
        console.log("各ポケモンの詳細情報を取得して追加")
        var tmpList = [];
        for (const pokemonResult of pokemons.value.results) {
            console.log("URL: " + pokemonResult.url);
            // ポケモンの詳細情報取得
            const response = await fetch(
                // URL
                pokemonResult.url,
            )
            const detail = await response.json();
            console.log("単純fetchのresponseをjson変換したもの: " + detail);

            // 取得した詳細情報から、タイプ、画像（前後）を取得
            types = detail.types;
            pokemonFrontDefaultImg = detail.sprites.front_default;
            pokemonBackDefaultImg = detail.sprites.back_default;

            // 一覧情報と詳細情報を結合してtmpリストに追加
            tmpList.push({
                ...pokemonResult,
                types,
                imgFront: pokemonFrontDefaultImg,
                imgBack: pokemonBackDefaultImg,
            });
            pokemonsWithDetailsListLength.value = tmpList.length;
        }

        // ポケモン詳細情報リストを更新
        pokemonsWithDetailsList.value = tmpList;

        console.log("詳細情報: " + pokemonsWithDetailsList.value);
    }
    catch (err) {
        error.value = err;
    } finally {
        // なにか最後にやりたい処理があればここに書く
        isExistPokemonDetails.value = true;
    }
}
</script>

<template>
    <div>
        <h1>ポケモンをつかまえる画面だよ</h1>
        <h2>次やること：詳細取得した後にフィルタかける</h2>
        <h3>{{ pokemons.count }} しゅるいのポケモン</h3>
        <h3>{{ pokemonsWithDetailsListLength }} / {{ pokemons.count }} 詳細取得済</h3>
        <div v-if="loading">読み込み中...</div>
        <div v-else-if="error">エラーが発生しました: {{ error.message }}</div>

        <!-- ポケモン詳細の操作 -->
        <div class="details-action-item">
            <!-- ポケモン詳細情報を取得するボタン -->
            <GamifyButton @click="getPokemonDetails()">くわしく GETだぜ</GamifyButton>
            <!-- ポケモン詳細情報を取得するボタン -->
            <div v-if="isExistPokemonDetails">
                <!-- TODO -->
                <!-- タイプを最大２つ選択するダイアログを表示するボタン -->
                <!-- 選択タイプに基づいて詳細情報リストにフィルタをかける -->
                <!-- 選択タイプはどこかに表示する -->
                <!-- 既存のgetPokemonDetailsに選択タイプをわたすのがよさそう。指定なしの場合は全てにして。 -->
                <GamifyButton @click="onTypeColorDialogOpen()">なにタイプがほしい？</GamifyButton>
            </div>
        </div>

        <!-- ポケモン一覧 -->
        <h2>ポケモン一覧</h2>
        <GamifyList>
            <GamifyItem v-for="(pokemonWithDetails, id) in pokemonsWithDetailsList" :key="id">
                <div v-if="pokemonWithDetails.imgFront">
                    <img :src="pokemonWithDetails.imgFront" alt="ポケモンフロント画像">
                    <img :src="pokemonWithDetails.imgBack" alt="ポケモンバック画像">
                </div>
                <!-- GamifyItemの中でのみpokemon-nameスタイルクラスが有効 -->
                <span class="pokemon-name">
                    {{ pokemonWithDetails.name }}
                </span>
                <GamifyButton @click="onOpen(pokemonWithDetails.name)">つかまえる</GamifyButton>
                {{ pokemonWithDetails }}
            </GamifyItem>
        </GamifyList>

        <!-- 確認ダイアログ -->
        <GamifyDialog v-if="dialog" id="confirm-catch" title="かくにん" :description="`ほう！　${dialog.name}　にするんじゃな？`"
            @close="onClose">
            <GamifyList :border="false" direction="horizon">
                <GamifyItem>
                    <GamifyButton @click="onClose">いいえ</GamifyButton>
                </GamifyItem>
                <GamifyItem>
                    <GamifyButton @click="onCatch(dialog)">はい</GamifyButton>
                </GamifyItem>
            </GamifyList>
        </GamifyDialog>

        <!-- タイプ選択ダイアログ -->
        <GamifyDialog v-if="typeColorDialog" id="confirm-catch" title="かくにん" :description="`タイプを２しゅるい えらぶのじゃ`"
            @close="onTypeColorDialogClose">
            <div class="type-selection-dialog-item">
                <TypeColorWheel />
            </div>

            <GamifyItem>
                <GamifyButton @click="onTypeColorDialogClose">完了</GamifyButton>
            </GamifyItem>

        </GamifyDialog>


        <!-- <h2>ポケモン一覧</h2>
        <GamifyList>
            <li v-for="(pokemon, id) in pokemons.results" :key="id">
                {{ pokemon.name }}
                <GamifyButton>つかまえる</GamifyButton>
            </li>
        </GamifyList> -->

    </div>
</template>

<style scoped>
.details-action-item {
    display: flex;
    align-items: center;
    margin-bottom: 2px;
}

.type-selection-dialog-item {
    display: flex;
    align-items: center;
    margin-bottom: 2px;
}
</style>