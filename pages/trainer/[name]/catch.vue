<script setup>

// ポケモンリスト
const pokemons = ref([]);

// ローディング中かどうか
const loading = ref(true);

// エラーがあったかどうか
const error = ref(null);

const fetchPokemons = async () => {
  try {
    const { data } = await useFetch('https://pokeapi.co/api/v2/pokemon/');
    pokemons.value = data.results;
} catch (err) {
    error.value = err;
  } finally {
    loading.value = false;
    console.log("Pokemons: " + pokemons.value);
  }
};

fetchPokemons;


</script>

<template>
 <h1>ポケモンをつかまえる画面だよ</h1>
 <div v-if="loading">読み込み中...</div>
    <div v-else-if="error">エラーが発生しました: {{ error.message }}</div>
</template>

<style scoped>
</style>