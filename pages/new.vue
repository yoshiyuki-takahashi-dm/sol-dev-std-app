<script setup>
// import
import { ref } from 'vue';
import GamifyButton from '~/components/GamifyButton.vue';

// 入力した名前state
const name = ref('');

// ボタン押下に対応するイベント
const logName = () => {
  console.log(name.value);
};

</script>

<template>
  <div>
    <h1>あたらしくはじめる</h1>
    <p>では　はじめに　きみの　なまえを　おしえて　もらおう！</p>
    
    <!-- GamifyButtonではなくてここに対応するメソッドを記述するのがよくわかってない -->
    <form @submit.prevent="logName">
      <p>なまえ</p>
      <p>とくていの　もじは　とりのぞかれるぞ！</p>
      <input type="text" v-model="name" placeholder="なまえを入力してください">
      <GamifyButton>けってい</GamifyButton>
    </form>
  </div>
</template>

<style scoped>
form {
  border-radius: 0.5rem;
  border: solid 4px #555;
  padding: 1.5rem 3rem;
}

form > :not(:last-child) {
  display: block;
  margin-bottom: 1rem;
}

.item > label,
.item > span {
  display: block;
  margin-bottom: 0.25rem;
}
.item > span {
  font-size: 0.875rem;
}
</style>
