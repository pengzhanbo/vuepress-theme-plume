<script setup lang="ts">
import type { MenuItem } from '../../composables/outline.js'

defineProps<{
  headers: MenuItem[]
  root?: boolean
}>()

function onClick({ target: el }: Event) {
  const id = (el as HTMLAnchorElement).href!.split('#')[1]
  const heading = document.getElementById(decodeURIComponent(id))
  heading?.focus({ preventScroll: true })
}
</script>

<template>
  <ul :class="root ? 'root' : 'nested'">
    <li v-for="{ children, link, title } in headers" :key="link">
      <a class="outline-link" :href="link" :title="title" @click="onClick">{{ title }}</a>
      <template v-if="children?.length">
        <DocOutlineItem :headers="children" />
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
  padding-left: 16px;
}

.outline-link {
  display: block;
  overflow: hidden;
  font-weight: 400;
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
