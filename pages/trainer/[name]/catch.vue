<script setup>
import useTypeColorDialogDialog from '~/composables/useTypeColorDialog.js';
import TypeColorWheel from '~/components/TypeColorWheel.vue';

const route = useRoute(); // 現在のルート情報にアクセスするためのフック
const router = useRouter(); // ルーターを使うためのフック
const config = useRuntimeConfig();

// ポケモンリスト
var data = null;
var pokemons = null;
var pokemonsWithDetailsListMaster = [];
var pokemonsWithDetailsListToShow = ref([]);
var types = null;
var pokemonFrontDefaultImg = null;
var pokemonBackDefaultImg = null;
var pokemonsWithDetailsListLength = ref(0);
var isExistPokemonDetails = ref(false);
var selectedTypes = [];

// ローディング中かどうか
const loading = ref(true);

// エラーがあったかどうか
const error = ref(null);

// ポケモン一覧取得時のオフセット
const offset = 0;

// ポケモン一覧取得時のリミット
// 指定しないと20になって少ない
// MAXほしい場合は1034に設定
const numberOfGetDetails = ref(100);

// ポケモン一覧取得
try {
    data = await useFetch(
        () =>
            // ポケモン一覧取得API. offsetとlimitで取得範囲を指定
            `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${numberOfGetDetails.value}`,
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
    pokemonsWithDetailsListToShow.value = tmpInitialList;

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
    // ポケモン詳細情報取得
    try {
        // すでにある詳細数と詳細取得数が同じ場合は再取得せずにfinallyのフィルタのみ実行
        // todo: 詳細なし, 詳細あり, どちらもpokemonsWithDetailsListなのがややこしい。余力があったら分離する。
        if (pokemonsWithDetailsListMaster.length != numberOfGetDetails.value) {
            // 詳細なし一覧にpushすることがないように、初回は更新前にクリア
            pokemonsWithDetailsListToShow.value = [];

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
            pokemonsWithDetailsListMaster = tmpList;
            console.log("詳細情報: " + pokemonsWithDetailsListMaster);
        }else{
            console.log("すでに" + numberOfGetDetails.value + "件は詳細取得済みです");
        }
    }
    catch (err) {
        error.value = err;
    } finally {
        // タイプフィルタ
        if (selectedTypes.length > 0) {
            console.log("選択されたタイプでフィルタリング");
            console.log("選択されたタイプ: " + selectedTypes);
            // フィルタリング
            var filteredList = pokemonsWithDetailsListMaster.filter((pokemon) => {
                if (selectedTypes.length === 1) {
                    // 1つのタイプでフィルタリング
                    return pokemon.types.some(type => selectedTypes.includes(type.type.name));
                } else if (selectedTypes.length === 2) {
                    // 2つのタイプでフィルタリング (AND)
                    return selectedTypes.every(selectedType => pokemon.types.some(type => type.type.name === selectedType));
                }
                return true;
            });
            pokemonsWithDetailsListToShow.value = filteredList;
        } else {
            console.log("選択されたタイプがないので全て表示");
            pokemonsWithDetailsListToShow.value = pokemonsWithDetailsListMaster;
        }

        // 詳細取得済フラグを立てる
        isExistPokemonDetails.value = true;
    }
}

// タイプ選択ダイアログの色相環から選択されたタイプを取得
const selectTypesEvent = (selectTypes) => {
    selectedTypes = selectTypes;
    console.log(`${selectedTypes}を選択しました`);
};

// タイプ選択を空にする
const clearSelectedTypes = () => {
    console.log("選択タイプを空にします");
    selectedTypes = [];
};

// ぽけもんをつかまえる
// フロントでポケモン情報を取得しておいて、bodyにつめて、バックエンドにポストする
const onCatch = async (pokemonName) => {
    console.log("pokemon frontget開始：" + pokemonName);
    // ぽけもん取得
    // ポケモンの詳細情報取得
    const responsePokemon = await fetch(
        // URL
        `https://pokeapi.co/api/v2/pokemon/${pokemonName}`,
    )
    const responsePokemonJson = await responsePokemon.json();

    console.log("ぽけもんの名前指定で取得した情報: " + responsePokemonJson);

    // responsePokemonJsonをすべてbodyにつめると重いので、必要な情報だけつめる
    // 実際、重いってエラーが出てfetchできなかった
    const {
      order,
      name,
    } = responsePokemonJson;

    console.log("トレーナー名：" + route.params.name)+"がポケモンをつかまえるよ";
    const response = await $fetch(`/api/trainer/${route.params.name}/pokemon/frontget`, {
        baseURL: config.public.backendOrigin,
        method: "POST",
        body: {
            pokemon: {
                "order": order,
                "name": name,
                "img": responsePokemonJson.sprites.front_default,
            },
        },
    }).catch((e) => e);
    if (response instanceof Error) return;

    console.log("ぽけもんつかまえる 結果" + response)

    // 問題なくS3に保存できればトレーナーページに戻る
    router.push(`/trainer/${route.params.name}`);
};

</script>

<template>
    <div>
        <h1>ポケモンをつかまえる画面だよ</h1>
        <h3>{{ pokemons.count }} しゅるい の ポケモン が いるよ</h3>
        <h4>詳細取得 したい 数 を 入力して ください</h4>
        <input type="number" v-model="numberOfGetDetails" placeholder="詳細取得したい数を入力してください" @keydown.enter="onOpen(true)">
        <h3>{{ pokemonsWithDetailsListLength }} / {{ pokemons.count }} 取得済</h3>
        <div v-if="loading">読み込み中...</div>
        <div v-else-if="error">エラーが発生しました: {{ error.message }}</div>

        <!-- ポケモン詳細の操作 -->
        <div class="details-action-item">
            <!-- ポケモン詳細情報を取得するボタン -->
            <GamifyButton @click="getPokemonDetails()">くわしく GETだぜ</GamifyButton>
            <!-- ポケモン詳細情報を取得するボタン -->
            <div v-if="isExistPokemonDetails">
                <GamifyButton @click="() => { clearSelectedTypes(); onTypeColorDialogOpen() }">なにタイプがほしい？</GamifyButton>
                <span>選択タイプ: {{ selectedTypes }}</span>
            </div>
        </div>

        <!-- ポケモン一覧 -->
        <h2>ポケモン一覧</h2>
        <GamifyList>
            <GamifyItem v-for="(pokemonWithDetails, id) in pokemonsWithDetailsListToShow" :key="id">
                <div v-if="pokemonWithDetails.imgFront">
                    <img :src="pokemonWithDetails.imgFront" alt="ポケモンフロント画像">
                    <img :src="pokemonWithDetails.imgBack" alt="ポケモンバック画像">
                </div>
                <!-- GamifyItemの中でのみpokemon-nameスタイルクラスが有効 -->
                <span class="pokemon-name">
                    {{ pokemonWithDetails.name }}
                </span>
                <!-- ダイアログを開く -->
                <GamifyButton @click="onOpen(pokemonWithDetails.name);">つかまえる</GamifyButton>
            </GamifyItem>
        </GamifyList>

        <!-- 確認ダイアログ -->
        <GamifyDialog v-if="dialog" id="confirm-catch" title="かくにん" :description="`ほう！　${dialog}　にするんじゃな？`"
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
            @close="() => { clearSelectedTypes(); onTypeColorDialogClose() }">
            <div class="type-selection-dialog-item">
                <TypeColorWheel @select-types="selectTypesEvent" class="dialog"/>
            </div>

            <GamifyItem>
                <!-- 完了ボタンで閉じた場合は、選択タイプでポケモン一覧を取得しなおす -->
                <GamifyButton @click="() => { onTypeColorDialogClose(); getPokemonDetails(); }">完了</GamifyButton>
            </GamifyItem>

        </GamifyDialog>
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