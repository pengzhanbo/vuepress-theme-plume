<script setup lang="ts">
import type { BlogCategoryItem } from '../../composables/index.js'
import VPCategories from '@theme/Blog/VPCategories.vue'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vuepress/client'

const props = defineProps<{
  item: BlogCategoryItem
}>()

const route = useRoute()
const el = ref<HTMLDivElement | null>(null)
const active = ref(true)
const isActive = ref(false)

watch(
  () => [route.query, props.item],
  () => {
    const id = route.query.id as string
    if (!id) {
      active.value = true
    }
    else {
      active.value = hasActive(props.item, id)
    }
    isActive.value = id ? props.item.id === id : false
  },
  { immediate: true },
)

function hasActive(item: BlogCategoryItem, id: string) {
  return item.id === id
    || item.items.filter(item => item.type === 'category').some(item => hasActive(item, id))
}

function toggle() {
  active.value = !active.value
}

onMounted(() => {
  if (el.value && isActive.value) {
    el.value.scrollIntoView({ block: 'center' })
  }
})
</script>

<template>
  <div ref="el" class="vp-category-group" :class="{ active }">
    <p class="folder" @click="toggle">
      <span class="icon" :class="[active ? 'vpi-folder-open' : 'vpi-folder']" />
      <span>{{ item.title }}</span>
    </p>

    <VPCategories
      v-if="item.items.length"
      class="group"
      :items="item.items"
    />
  </div>
</template>

<style scoped>
.vp-category-group {
  position: relative;
}

.vp-category-group::after {
  position: absolute;
  top: 30px;
  bottom: 0;
  left: 8px;
  display: block;
  content: "";
  border-left: 1px solid var(--vp-c-divider);
  transition: border var(--vp-t-color);
}

.vp-category-group .folder {
  display: flex;
  align-items: center;
  margin: 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: color var(--vp-t-color);
}

.vp-category-group .folder:hover {
  color: var(--vp-c-text-1);
}

@media (min-width: 768px) {
  .vp-category-group .folder {
    font-size: 18px;
  }
}

.vp-category-group .folder .icon {
  display: inline-block;
  width: 1em;
  margin-right: 8px;
}

.vp-category-group > .group {
  display: none;
  margin-left: 22px;
}

@media (min-width: 768px) {
  .vp-category-group > .group {
    margin-left: 26px;
  }
}

.vp-category-group.active > .group {
  display: block;
}
</style>
