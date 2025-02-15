import { ref, computed } from 'vue';

// ポケモン一覧ストア
// メソッドを介してのみ、データ（pokemonList）を操作する
export function usePokemonListStore() {
    const pokemonList = ref(null);
    const offset = 0; // ポケモン一覧取得時のオフセット
    const limit = 10; // ポケモン一覧取得時のリミット

    // ポケモン一覧取得
    const startFetchPokemonList = async () => {
        console.log("usePokemonListStore");
        try {
            const response = await fetch(
                    // ポケモン一覧取得API. offsetとlimitで取得範囲を指定
                    `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`,
            );
            const data = await response.json();
            pokemonList.value = data;
        }
        catch (err) {
            console.error(err);
        }
        finally {
            console.log(pokemonList.data);
        }
    }

    // List内のポケモンの数を取得する
    const getCountList = () => { return pokemonList.value.data.count };

    // Listを取得する
    const getList = () => { return pokemonList };
};