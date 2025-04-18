<template>
  <div class="flex content-h-170 acgn-item-body">
    <div class="flex-shrink-0 relative book-cover-body">
      <div
        class="acgn-item-cover-body relative content-h-139 flex justify-center items-center border border-solid border-gray-300 rounded-md p-1"
      >
        <WikimoeImage
          class="max-image rounded book-cover"
          :class="{ 'movie-cover-none': !book.cover }"
          :src="book.cover || '/img/nopic400-565.png'"
          :alt="book.title"
          :data-href="book.cover"
          :data-href-list="book.cover ? setDataHrefList(book.cover) : null"
          loading="lazy"
          fit="contain"
        />
        <div class="absolute bottom-0 left-0 p-1" v-if="book.label?.length > 0">
          <UBadge
            v-for="(label, index) in book.label"
            :key="index"
            size="xs"
            class="mr-1"
          >
            {{ label }}
          </UBadge>
        </div>
      </div>
      <Rating :rating="book.rating" />
    </div>
    <div class="acgn-right-content content-h-170 custom-scroll">
      <div class="w-full flex flex-col">
        <div class="font-bold mb-1 flex-shrink-0">
          <span
            class="books-platform-block"
            :style="{
              backgroundColor: book.booktype.color,
            }"
            v-if="book.booktype"
            >{{ book.booktype.name }}</span
          >{{ book.title }}
        </div>
        <div
          class="text-sm mb-1 text-gray-400 flex-shrink-0 w_10 flex items-center"
          v-if="book.giveUp"
        >
          <div v-if="book.startTime && book.endTime">
            <div class="acgn-time text-gray-400">
              {{
                `${formatDate(
                  book.startTime,
                  'yyyy年M月dd日 h时'
                )} ~ ${formatDate(book.endTime, 'yyyy年M月dd日 h时')}`
              }}
            </div>
            <div
              class="text-sm mb-1 text-gray-400 flex-shrink-0 w_10 flex items-center"
            >
              <UIcon
                name="i-heroicons-bookmark-slash"
                class="align-middle acgn-time-icon"
              />阅读{{ getACGDuration(book.startTime, book.endTime) }}后弃坑
            </div>
          </div>
          <template v-else>
            <UIcon
              name="i-heroicons-bookmark-slash"
              class="align-middle acgn-time-icon"
            />已弃坑
          </template>
        </div>
        <!-- 用时 -->
        <div v-else-if="book.startTime">
          <div class="acgn-time text-gray-400">
            {{
              `${formatDate(book.startTime, 'yyyy年M月dd日 h时')} ~ ${
                book.endTime
                  ? formatDate(book.endTime, 'yyyy年M月dd日 h时')
                  : '阅读中'
              }`
            }}<LoadingDots v-if="!book.endTime && showAnimeDot" />
          </div>
          <div
            class="text-sm mb-1 text-gray-400 flex-shrink-0 w_10 flex items-center"
          >
            <template v-if="!book.endTime"
              ><UIcon
                name="i-heroicons-clock"
                class="align-middle acgn-time-icon"
              />已累计阅读</template
            ><template v-else
              ><UIcon
                name="i-heroicons-star"
                class="align-middle acgn-time-icon"
              />共计阅读</template
            >{{ getACGDuration(book.startTime, book.endTime) }}
          </div>
        </div>
        <!-- 链接 -->
        <div
          class="text-sm mb-1 text-gray-500 flex-shrink-0"
          v-if="book.urlList.length > 0"
        >
          <a
            :href="url.url"
            target="_blank"
            class="inline-flex items-center text-primary mr-2"
            v-for="(url, index) in book.urlList"
            :key="index"
          >
            <UIcon name="i-heroicons-link" class="align-middle mr-1" />
            {{ url.text }}
          </a>
        </div>

        <div class="acg-summary">
          <!-- prettier-ignore -->
          <div class="text-sm whitespace-pre-line text-gray-500 flex-grow dark:text-gray-300" v-if="book.summary">{{ book.summary }}</div>
          <div v-else class="text-sm text-gray-400">暂无内容</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  book: {
    type: Object,
    required: true,
  },
  showAnimeDot: {
    type: Boolean,
    default: true,
  },
})

const setDataHrefList = (cover) => {
  return [
    {
      filepath: cover,
    },
  ]
}
</script>
<style scoped>
.book-cover-body {
  width: 100px;
}
.books-platform-block {
  color: #fff;
  padding: 2px 5px;
  border-radius: 2px;
  font-size: 12px;
  margin-right: 5px;
  border-radius: 5px;
  display: inline-block;
  line-height: 18px;
}
</style>
