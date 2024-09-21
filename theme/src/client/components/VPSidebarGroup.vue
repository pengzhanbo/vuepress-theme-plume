<script setup lang="ts">
import type { ResolvedSidebarItem } from '../../shared/index.js'
import VPSidebarItem from '@theme/VPSidebarItem.vue'
import { onBeforeUnmount, onMounted, ref } from 'vue'

defineProps<{
  items: ResolvedSidebarItem[]
}>()

const disableTransition = ref(true)
let timer: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  timer = setTimeout(() => {
    timer = null
    disableTransition.value = false
  }, 300)
})

onBeforeUnmount(() => {
  if (timer != null) {
    clearTimeout(timer)
    timer = null
  }
})
</script>

<template>
  <div
    v-for="item in items"
    :key="item.text"
    class="group"
    :class="{ 'no-transition': disableTransition }"
  >
    <VPSidebarItem :item="item" :depth="0" />
  </div>
</template>

<style scoped>
.no-transition :deep(.caret-icon) {
  transition: none;
}

.group + .group {
  padding-top: 10px;
  border-top: 1px solid var(--vp-c-divider);
  transition: border var(--vp-t-color);
}

@media (min-width: 960px) {
  .group {
    width: calc(var(--vp-sidebar-width) - 64px);
    padding-top: 10px;
  }
}
</style>
