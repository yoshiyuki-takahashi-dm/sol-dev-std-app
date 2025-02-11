<script setup>

// todo: ホーム画面からデモモードかどうかの情報を受け取る
const isDemo = ref(false);
const { data: trainers } = await useTrainers(isDemo.value);
console.log(trainers);
</script>

<template>
  <div>
    <h1>つづきからはじめる</h1>
    <GamifyList>
      <GamifyItem v-for="trainer in trainers" :key="trainer">
        <NuxtLink :to="`/trainer/${trainer}`">{{ trainer }}</NuxtLink>
      </GamifyItem>
    </GamifyList>
  </div>
</template>