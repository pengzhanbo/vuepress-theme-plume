<script setup lang="ts">
import type { PageHeader } from 'vuepress/client'

defineProps<{
  headers: PageHeader[]
  root?: boolean
}>()

function handleClick({ target: el }: Event) {
  const id = `#${(el as HTMLAnchorElement).href!.split('#')[1]}`
  const heading = document.querySelector<HTMLAnchorElement>(
    decodeURIComponent(id),
  )
  heading?.focus({ preventScroll: true })
}
</script>

<template>
  <ul :class="root ? 'root' : 'nested'">
    <li v-for="{ children, link, title } in headers" :key="link">
      <a class="outline-link" :href="link" @click="handleClick">{{ title }}</a>
      <template v-if="children?.length">
        <PageAsideItem :headers="children" />
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
  overflow: hidden;
  line-height: 28px;
  color: var(--vp-c-text-2);
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color var(--t-color);
}

.outline-link:hover,
.outline-link.active {
  color: var(--vp-c-text-1);
}

.outline-link.nested {
  padding-left: 13px;
}
</style>
