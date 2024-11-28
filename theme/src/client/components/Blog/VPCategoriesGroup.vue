<script setup lang="ts">
import type { BlogCategoryItem } from '../../composables/index.js'
import VPCategories from '@theme/Blog/VPCategories.vue'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vuepress/client'
import { useData } from '../../composables/index.js'

const props = withDefaults(defineProps<{
  item: BlogCategoryItem
  depth?: number
}>(), {
  depth: 0,
})
const { blog } = useData()
const route = useRoute()
const el = ref<HTMLDivElement | null>(null)
const expand = ref(true)
const isExpand = ref(false)

const expandDepth = computed(() => {
  const depth = blog.value.categoriesExpand ?? 'deep'
  if (depth === 'deep')
    return Infinity
  const d = Number(depth)
  if (Number.isNaN(d))
    return Infinity
  return d
})

watch(
  () => [route.query, props.item, expandDepth.value],
  () => {
    const id = route.query.id as string
    if (!id) {
      expand.value = props.depth <= expandDepth.value
    }
    else {
      expand.value = hasExpand(props.item, id)
    }
    isExpand.value = id ? props.item.id === id : false
  },
  { immediate: true },
)

function hasExpand(item: BlogCategoryItem, id: string) {
  return item.id === id
    || item.items.filter(item => item.type === 'category').some(item => hasExpand(item, id))
}

function toggle() {
  expand.value = !expand.value
}

onMounted(() => {
  if (el.value && isExpand.value) {
    el.value.scrollIntoView({ block: 'center' })
  }
})
</script>

<template>
  <div ref="el" class="vp-category-group" :class="{ expand }">
    <p class="folder" @click="toggle">
      <span class="icon" :class="[expand ? 'vpi-folder-open' : 'vpi-folder']" />
      <span>{{ item.title }}</span>
    </p>

    <VPCategories
      v-if="item.items.length"
      class="group"
      :items="item.items"
      :depth="depth"
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

.vp-category-group.expand > .group {
  display: block;
}
</style>
