<template>
  <div class="rating-body">
    <div
      v-if="rating"
      class="text-sm text-primary border border-solid border-primary-400 text-center rounded"
    >
      <span>{{ rating }}</span
      >分 | {{ ratingToText(rating) }}
    </div>
    <div
      v-else
      class="text-sm text-gray-300 border border-solid border-gray-300 text-center rounded"
    >
      暂无评分
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  rating: {
    type: Number,
    default: 0,
  },
})
</script>
<style scoped>
.rating-body {
  margin-top: 9px;
}
</style>
