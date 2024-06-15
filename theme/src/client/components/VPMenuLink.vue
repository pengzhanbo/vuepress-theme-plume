<script lang="ts" setup>
import { useData } from '../composables/data.js'
import { isActive } from '../utils/index.js'
import VPLink from './VPLink.vue'
import VPIcon from './VPIcon.vue'

defineProps<{
  item: any
}>()

const { page } = useData()
</script>

<template>
  <div class="vp-menu-link">
    <VPLink
      :class="{
        active: isActive(
          page.path,
          item.activeMatch || item.link,
          !!item.activeMatch,
        ),
      }"
      :href="item.link"
    >
      <VPIcon v-if="item.icon" :name="item.icon" />
      <i v-text="item.text" />
    </VPLink>
  </div>
</template>

<style scoped>
.vp-menu-group + .vp-menu-link {
  padding: 12px 12px 0;
  margin: 12px -12px 0;
  border-top: 1px solid var(--vp-c-divider);
  transition: border-top var(--t-color);
}

.link {
  display: block;
  padding: 0 12px;
  font-size: 14px;
  font-weight: 500;
  line-height: 32px;
  color: var(--vp-c-text-1);
  white-space: nowrap;
  border-radius: 6px;
  transition:
    background-color var(--t-color),
    color var(--t-color);
}

.link:hover {
  color: var(--vp-c-brand-1);
  background-color: var(--vp-c-default-soft);
}

.link.active {
  color: var(--vp-c-brand-1);
}
</style>
