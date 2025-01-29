<script setup></script>

<template>
  <div class="start-content">
    <h1>ポケットモンスター</h1>
    <h2>POCEKT  MONSTER</h2>
    <h3>Solution Developer Standard Version</h3>
    <div>
      <img src="/VideoToGif_goodSample.gif" alt="Animation" class="start-trainer-img">
    </div>
    <GamifyList class="start-action-content">
      <GamifyItem class="start-action-content-item">
        <NuxtLink to="/trainer">つづきからはじめる</NuxtLink>
      </GamifyItem>
      <GamifyItem class="start-action-content-item">
        <NuxtLink to="/new">あたらしくはじめる</NuxtLink>
      </GamifyItem>
    </GamifyList>
    <h3>2025 KM FREAK Inc.</h3>
  </div>
</template>

<!-- この画面だけに効くstyle -->
<style scoped>
.start-trainer-img{
  width: 50%; /* 親要素の幅に合わせる */
  height: auto; /* アスペクト比を維持 */
}
.start-content {
  text-align: center; /* テキストとインライン要素を中央揃え */
}
.start-content img {
  display: block;
  margin: 0 auto; /* 画像を中央揃え */
}
.start-action-content {
  display: flex;
  justify-content: center; /* GamifyListを中央揃え */
  margin-top: 20px; /* 必要に応じてマージンを調整 */
}
.start-action-content-item {
  margin-left: 20px; /* 必要に応じてマージンを調整 */
  margin-right: 20px; /* 必要に応じてマージンを調整 */
}
</style>


<!-- 全体に効かせるstyle -->
<!-- GB時代っぽいは背景色にしたいけどgif, imgの透過できるまで保留 -->
<style>
html, body {
  background-color: #f0f0f0; /* お好みの背景色 */
}
</style>