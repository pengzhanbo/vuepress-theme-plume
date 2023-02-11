<script setup lang="ts">
import type { PageHeader } from '@vuepress/client'

defineProps<{
  headers: PageHeader[]
  onClick: (e: MouseEvent) => void
  root?: boolean
}>()
</script>

<template>
  <ul :class="root ? 'root' : 'nested'">
    <li v-for="{ children, link, title } in headers" :key="link">
      <a class="outline-link" :href="link" @click="onClick">{{ title }}</a>
      <template v-if="children?.length">
        <PageAsideItem :headers="children" :on-click="onClick" />
      </template>
    </li>
  </ul>
</template>

<style scoped>
.root {
  position: relative;
  z-index: 1;
}

.nested {
  padding-left: 13px;
}

.outline-link {
  display: block;
  line-height: 28px;
  color: var(--vp-c-text-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.5s;
}

.outline-link:hover,
.outline-link.active {
  color: var(--vp-c-text-1);
  transition: color 0.25s;
}

.outline-link.nested {
  padding-left: 13px;
}
</style>
