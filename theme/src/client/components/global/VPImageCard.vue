<script setup lang="ts">
import { computed } from 'vue'
import { usePageLang, withBase } from 'vuepress/client'

const props = defineProps<{
  image: string
  title?: string
  description?: string
  href?: string
  author?: string
  date?: string | Date | number
  width?: string | number
  center?: boolean
}>()

const lang = usePageLang()

const date = computed(() => {
  if (!props.date)
    return ''
  const date = props.date instanceof Date ? props.date : new Date(props.date)
  const intl = new Intl.DateTimeFormat(
    lang.value,
    { year: 'numeric', month: 'short', day: 'numeric' },
  )

  return intl.format(date)
})

const styles = computed(() => {
  const width = props.width
    ? String(Number(props.width)) === String(props.width)
      ? `${props.width}px`
      : props.width
    : undefined

  return { width }
})
</script>

<template>
  <div class="vp-image-card" :style="styles" :class="{ center }">
    <div class="image-container">
      <img :src="withBase(image)" :alt="title" loading="lazy">
      <div v-if="title || author || date || description" class="image-info">
        <h3 v-if="title" class="title">
          <a v-if="href" :href="href" target="_blank" rel="noopener noreferrer" class="no-icon">{{ title }}</a>
          <span v-else>{{ title }}</span>
        </h3>
        <p v-if="author || date" class="copyright">
          <span v-if="author">{{ author }}</span>
          <span v-if="author && date"> | </span>
          <span v-if="date">{{ date }}</span>
        </p>
        <p v-if="description" class="description">
          {{ description }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vp-image-card {
  max-width: 100%;
  margin: 16px 0;
  border-radius: 8px;
  box-shadow: var(--vp-shadow-2);
  transition: var(--vp-t-color);
  transition-property: box-shadow;
}

.vp-image-card.center {
  margin: 16px auto;
}

.vp-image-card:hover {
  box-shadow: var(--vp-shadow-4);
}

.vp-image-card .image-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-size: 0;
  line-height: 1;
  border-radius: 8px;
}

.image-container img {
  width: 100%;
  height: 100%;

  object-fit: cover;
}

.image-info {
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 100%;
  padding: 16px 20px 0;
  overflow-y: hidden;
  font-size: 14px;
  color: var(--vp-c-white);
  background-color: rgb(0 0 0 / 0.5);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  transition: transform var(--vp-t-color);
  transform: translateY(calc(100% - 60px));
}

:where(.vp-card-grid.cols-3, .vp-card-masonry.cols-3) .image-info {
  padding: 8px 8px 0;
  font-size: 12px;
  transform: translateY(calc(100% - 36px));
}

@media (max-width: 767px) {
  :where(.vp-card-grid.cols-2, .vp-card-masonry.cols-2) .image-info {
    padding: 8px 8px 0;
    font-size: 12px;
    transform: translateY(calc(100% - 36px));
  }
}

.image-info:hover {
  transform: translateY(0);
}

.image-info .title {
  min-height: 28px;
  margin: 0 0 16px;
  overflow: hidden;
  font-size: 18px;
  color: var(--vp-c-white);
  text-overflow: ellipsis;
  white-space: nowrap;
}

:where(.vp-card-grid.cols-3, .vp-card-masonry.cols-3) .image-info .title {
  min-height: 20px;
  margin: 0 0 8px;
  font-size: 14px;
  line-height: 20px;
}

@media (max-width: 767px) {
  :where(.vp-card-grid.cols-2, .vp-card-masonry.cols-2) .image-info .title {
    min-height: 20px;
    margin: 0 0 8px;
    font-size: 14px;
    line-height: 20px;
  }
}

.image-info .title a {
  color: inherit;
  text-decoration: none;
}

.image-info p {
  margin: 0;
  line-height: 24px;
  color: var(--vp-c-white);
}

:where(.vp-card-grid.cols-3, .vp-card-masonry.cols-3) .image-info p {
  line-height: 20px;
}

@media (max-width: 767px) {
  :where(.vp-card-grid.cols-2, .vp-card-masonry.cols-2) .image-info p {
    line-height: 20px;
  }
}

.image-info p:last-child {
  margin-bottom: 16px;
}

.image-info .copyright {
  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: flex-end;
}

.image-info .copyright span:first-child {
  flex: 1 2;
  overflow: hidden;
  text-align: right;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.image-info .description {
  flex: 1 2;
  height: 1px;
  overflow-y: auto;
}

.image-info .description::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>
