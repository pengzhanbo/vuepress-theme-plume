<script setup lang="ts">
import { computed } from 'vue'
import { usePageLang } from 'vuepress/client'

const props = defineProps<{
  image: string
  title?: string
  description?: string
  href?: string
  author?: string
  date?: string | Date | number
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
</script>

<template>
  <div class="vp-image-card">
    <div class="image-container">
      <img :src="image" :alt="title" loading="lazy">
      <div v-if="title" class="image-info">
        <h3 v-if="title" class="title">
          <a v-if="href" :href="href" target="_blank" rel="noopener noreferrer">{{ title }}</a>
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
  margin: 16px 0;
  box-shadow: var(--vp-shadow-2);
  transition: var(--t-color);
  transition-property: box-shadow;
}

.vp-image-card:hover {
  box-shadow: var(--vp-shadow-4);
}

.vp-image-card .image-container {
  position: relative;
  overflow: hidden;
  font-size: 0;
  line-height: 1;
  border-radius: 8px;
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
  background-color: rgba(0, 0, 0, 0.5);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  transition: transform var(--t-color);
  transform: translateY(calc(100% - 60px));
}

.vp-image-card:hover .image-info {
  transform: translateY(0);
}

.image-info .title {
  min-height: 28px;
  margin: 0 0 16px;
  overflow: hidden;
  font-size: 18px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.image-info .title a {
  color: inherit;
  text-decoration: none;
}

.image-info p {
  margin: 0;
  color: var(--vp-c-white);
}

.image-info p:last-child {
  margin-bottom: 16px;
}

.image-info .copyright {
  text-align: right;
}

.image-info .description {
  flex: 1;
  height: 1px;
  overflow-y: auto;
}
</style>
