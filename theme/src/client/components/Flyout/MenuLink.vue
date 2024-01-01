<script lang="ts" setup>
import { usePageData } from '@vuepress/client'
import { isActive } from '../../utils/index.js'
import AutoLink from '../AutoLink.vue'

defineProps<{
  item: any
}>()

const page = usePageData()
</script>

<template>
  <div class="menu-link">
    <AutoLink
      :class="{
        active: isActive(
          page.path,
          item.activeMatch || item.link,
          !!item.activeMatch,
        ),
      }"
      :href="item.link"
    >
      <Icon v-if="item.icon" :name="item.icon" />
      <i v-text="item.text" />
    </AutoLink>
  </div>
</template>

<style scoped>
.menu-group + .menu-link {
  margin: 12px -12px 0;
  border-top: 1px solid var(--vp-c-divider);
  padding: 12px 12px 0;
}

.link {
  display: block;
  border-radius: 6px;
  padding: 0 12px;
  line-height: 32px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  white-space: nowrap;
  transition:
    background-color 0.25s,
    color 0.25s;
}

.link:hover {
  color: var(--vp-c-brand-1);
  background-color: var(--vp-c-default-soft);
}

.link.active {
  color: var(--vp-c-brand-1);
}
</style>
