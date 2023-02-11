<script lang="ts" setup>
import MenuGroup from './MenuGroup.vue'
import MenuLink from './MenuLink.vue'

defineProps<{
  items?: any[]
}>()
</script>

<template>
  <div class="menu-wrapper">
    <div v-if="items" class="items">
      <template v-for="item in items" :key="item.text">
        <MenuLink v-if="'link' in item" :item="item" />
        <MenuGroup v-else :text="item.text" :items="item.items" />
      </template>
    </div>

    <slot />
  </div>
</template>

<style scoped>
.menu-wrapper {
  border-radius: 12px;
  padding: 12px;
  min-width: 128px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-elv);
  box-shadow: var(--vp-shadow-3);
  transition: background-color 0.5s;
  max-height: calc(100vh - var(--vp-nav-height));
  overflow-y: auto;
}

.menu-wrapper :deep(.group) {
  margin: 0 -12px;
  padding: 0 12px 12px;
}

.menu-wrapper :deep(.group + .group) {
  border-top: 1px solid var(--vp-c-divider);
  padding: 11px 12px 12px;
}

.menu-wrapper :deep(.group:last-child) {
  padding-bottom: 0;
}

.menu-wrapper :deep(.group + .item) {
  border-top: 1px solid var(--vp-c-divider);
  padding: 11px 16px 0;
}

.menu-wrapper :deep(.item) {
  padding: 0 16px;
  white-space: nowrap;
}

.menu-wrapper :deep(.label) {
  flex-grow: 1;
  line-height: 28px;
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  transition: color 0.5s;
}

.menu-wrapper :deep(.action) {
  padding-left: 24px;
}
</style>
