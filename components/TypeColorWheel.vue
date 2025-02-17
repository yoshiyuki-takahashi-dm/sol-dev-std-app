<template>
    <div class="type-color-wheel">
        <div v-for="(type, index) in types" :key="index"
            :style="{ backgroundColor: typeColors[type], transform: `rotate(${index * 20}deg) translate(100px) rotate(-${index * 20}deg)`, border: selectedTypes.includes(type) ? '2px solid black' : 'none' }"
            class="color-segment"
            @mouseover="showTooltip(type, $event)"
            @mouseleave="hideTooltip"
            @click="selectType(type)"></div>
        <div v-if="tooltip.visible" :style="{ top: tooltip.y + 'px', left: tooltip.x + 'px' }" class="tooltip">
            {{ tooltip.text }}
        </div>
        <div class="selected-types">
            <div v-for="(type, index) in selectedTypes" :key="index" class="selected-type">
                {{ type }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

// 選択されたタイプを保存する配列
const selectedTypes = ref([]);

// ポケモン18タイプに対応する文字列の配列
const types = ref([
    'Fire', 'Water', 'Grass', 'Electric', 'Ice', 'Fighting',
    'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock',
    'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy', 'Normal'
]);

// タイプに対応するカラーコードのマッピング
const typeColors = {
    'Fire': '#FF4500',
    'Water': '#1E90FF',
    'Grass': '#32CD32',
    'Electric': '#FFD700',
    'Ice': '#00FFFF',
    'Fighting': '#8B0000',
    'Poison': '#9400D3',
    'Ground': '#DEB887',
    'Flying': '#87CEEB',
    'Psychic': '#FF1493',
    'Bug': '#ADFF2F',
    'Rock': '#A52A2A',
    'Ghost': '#4B0082',
    'Dragon': '#00008B',
    'Dark': '#2F4F4F',
    'Steel': '#B0C4DE',
    'Fairy': '#FFB6C1',
    'Normal': '#D3D3D3'
};

// ツールチップの状態を管理するためのリアクティブなオブジェクト
const tooltip = ref({
    visible: false,
    text: '',
    x: 0,
    y: 0
});

// ツールチップを表示する関数
// TODO: ツールチップの位置を調整する。なぜかマウスから右下に離れて表示される。
const showTooltip = (text, event) => {
    tooltip.value.text = text;
    tooltip.value.x = event.clientX + 15; // マウスカーソルの少し右に表示
    tooltip.value.y = event.clientY + 15; // マウスカーソルの少し下に表示
    tooltip.value.visible = true;
};

// ツールチップを非表示にする関数
const hideTooltip = () => {
    tooltip.value.visible = false;
};

// タイプを選択する関数
const selectType = (type) => {
    if (selectedTypes.value.includes(type)) {
        // 既に選択されている場合は何もしない
        return;
    }
    if (selectedTypes.value.length >= 2) {
        // 配列が2つの要素でいっぱいの場合、最初の要素を削除
        selectedTypes.value.shift();
    }
    // 新しいタイプを追加
    selectedTypes.value.push(type);

    // 選択されたタイプを表示
    selectedTypes.value.forEach((type, index) => {
        console.log(`Type ${index + 1}: ${type}`);
    });

    // 選択したタイプを親コンポーネントに通知
    typeClickHandle();
};

// 選択したタイプを親コンポーネントに通知するカスタムイベント
const emit = defineEmits(['selectTypes']);
const typeClickHandle = () => {
    // カスタムイベントの発行(第2引数はイベントと一緒に伝えたい値)
    emit('selectTypes', selectedTypes.value);
};

</script>

<style scoped>
.type-color-wheel {
    position: relative;
    width: 220px; /* サイズを少し大きくして隙間を確保 */
    height: 220px; /* サイズを少し大きくして隙間を確保 */
    border-radius: 50%;
    margin: 0 auto;
}

.color-segment {
  position: absolute;
  width: 30px; /* 幅を少し小さくして隙間を確保 */
  height: 30px; /* 高さを少し小さくして隙間を確保 */
  transform-origin: center center;
  border-radius: 50%;
  margin: 5px; /* 各セグメントの間に隙間を追加 */
}

.tooltip {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 5px;
    border-radius: 3px;
    pointer-events: none; /* ツールチップがマウスイベントを受け取らないようにする */
    z-index: 1000; /* ツールチップを前面に表示 */
}
</style>
