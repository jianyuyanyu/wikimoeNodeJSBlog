<template>
  <div v-if="contentCount > 0" class="mt-4">
    <div
      class="mb-4 text-gray-600 dark:text-gray-200 font-bold text-base border-b border-dotted pb-3 border-gray-300 dark:border-gray-700"
    >
      相关作品：
    </div>
    <div
      class="grid gap-3 post-acg-grid"
      :class="{
        odd: contentCount % 2 === 1,
      }"
    >
      <div
        v-for="bangumi in bangumiList"
        :key="bangumi._id"
        class="post-acg-item"
      >
        <BangumiItem :bangumi="bangumi" showType />
      </div>
      <div v-for="movie in movieList" :key="movie._id" class="post-acg-item">
        <MovieItem :movie="movie" showType />
      </div>
      <div v-for="book in bookList" :key="book._id" class="post-acg-item">
        <BookItem :book="book" />
      </div>
      <div v-for="game in gameList" :key="game._id" class="post-acg-item">
        <GameItem :game="game" />
      </div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  bangumiList: {
    type: Array,
    default() {
      return []
    },
  },
  movieList: {
    type: Array,
    default() {
      return []
    },
  },
  gameList: {
    type: Array,
    default() {
      return []
    },
  },
  bookList: {
    type: Array,
    default() {
      return []
    },
  },
})
const contentCount = computed(() => {
  return (
    props.bangumiList.length +
    props.gameList.length +
    props.bookList.length +
    props.movieList.length
  )
})
</script>
<style scoped>
.post-acg-grid {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}
@media (min-width: 1280px) {
  .post-acg-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .post-acg-grid.odd .post-acg-item:last-child {
    grid-column: span 2;
  }
}
</style>
