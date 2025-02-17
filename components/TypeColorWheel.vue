<template>
    <div class="type-color-wheel">
        <div v-for="(color, index) in colors" :key="index"
            :style="{ backgroundColor: color, transform: `rotate(${index * 20}deg) translate(100px) rotate(-${index * 20}deg)` }"
            class="color-segment"></div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

// ポケモン18タイプに即した色相を設定
// TODO: タイプのカラーコードを公式から取得する
const colors = ref([
    '#FF0000', '#FF7F00', '#FFFF00', '#7FFF00', '#00FF00', '#00FF7F',
    '#00FFFF', '#007FFF', '#0000FF', '#7F00FF', '#FF00FF', '#FF007F',
    '#FF4D4D', '#FFB84D', '#FFFF4D', '#B8FF4D', '#4DFF4D', '#4DFFB8'
]);
</script>

<style scoped>
.type-color-wheel {
    position: relative;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    margin: 0 auto;
}

.color-segment {
    position: absolute;
    width: 40px;
    height: 40px;
    transform-origin: center center;
    border-radius: 50%;
}
</style>