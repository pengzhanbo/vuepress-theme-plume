<script setup lang="ts">
import type { VNode } from 'vue'
import { useDebounceFn, useMediaQuery, useResizeObserver } from '@vueuse/core'
import { cloneVNode, computed, markRaw, mergeProps, nextTick, onMounted, ref, shallowRef, useId, watch } from 'vue'

const props = withDefaults(defineProps<{
  cols?: number | { sm?: number, md?: number, lg?: number }
  gap?: number
}>(), {
  cols: () => ({ sm: 2, md: 2, lg: 3 }),
  gap: 16,
})

const slots = defineSlots<{ default: () => VNode[] | null }>()
const uuid = useId()

const columnsLength = ref(3)
const isMd = useMediaQuery('(min-width: 640px)')
const isLg = useMediaQuery('(min-width: 960px)')

const rawList = computed(() => {
  if (__VUEPRESS_SSR__)
    return []
  const res = slots.default?.()
  return ((Array.isArray(res) ? res : [res]) as VNode[]).map((item, index) =>
    markRaw(cloneVNode(item, mergeProps(item.props ?? {}, { class: `masonry-${uuid}-${index}` }))),
  )
})

function resolveColumnsLength() {
  let length = 1
  if (typeof props.cols === 'number') {
    length = props.cols
  }
  else if (typeof props.cols === 'object') {
    if (isLg.value)
      length = props.cols.lg || 3
    else if (isMd.value)
      length = props.cols.md || 2
    else
      length = props.cols.sm || 2
  }

  columnsLength.value = Number(length)
}

const columnsList = shallowRef<VNode[][]>([])
const masonry = shallowRef<HTMLDivElement>()

async function drawColumns() {
  await nextTick()
  if (!masonry.value)
    return

  const columns: VNode[][] = Array.from({ length: columnsLength.value }, () => [])
  const heights = Array.from({ length: columnsLength.value }, () => 0)

  for (let i = 0; i < rawList.value.length; i++) {
    const item = rawList.value[i]
    const el = masonry.value.querySelector(`.masonry-${uuid}-${i}`) as HTMLElement
    const height = el?.offsetHeight ?? 0
    const index = heights.indexOf(Math.min(...heights))

    columns[index].push(item)
    heights[index] += height + props.gap
  }
  columnsList.value = columns
}

onMounted(() => {
  if (__VUEPRESS_SSR__)
    return

  watch(() => [isMd.value, isLg.value, props.cols], resolveColumnsLength, { immediate: true })

  drawColumns()
  const debounceDraw = useDebounceFn(drawColumns)
  watch([rawList, columnsLength], debounceDraw, { flush: 'post' })
  useResizeObserver(masonry, debounceDraw)
})
</script>

<template>
  <div ref="masonry" class="vp-card-masonry" :class="[`cols-${columnsLength}`]" :style="{ 'grid-gap': `${props.gap}px`, '--card-masonry-cols': columnsLength }" data-allow-mismatch>
    <ClientOnly>
      <div v-for="(column, index) in columnsList" :key="`${uuid}-${index}`" class="card-masonry-item" :style="{ gap: `${props.gap}px` }">
        <component :is="item" v-for="item in column" :key="item.props!.class" />
      </div>
    </ClientOnly>
  </div>
</template>

<style>
.vp-card-masonry {
  display: grid;
  grid-template-columns: repeat(var(--card-masonry-cols), 1fr);
  height: max-content;
  margin: 16px 0;
}

.vp-card-masonry > .card-masonry-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
}

.vp-card-masonry > .card-masonry-item > [class*="masonry-v-"] {
  width: 100%;
  max-width: 100%;
  margin: 0 !important;
}

.card-masonry-item > [class*="masonry-v-"] > img:only-child,
.card-masonry-item > [class*="masonry-v-"] > a:only-child > img:only-child {
  display: block;
  border-radius: 8px;
  box-shadow: var(--vp-shadow-2);
}
</style>
