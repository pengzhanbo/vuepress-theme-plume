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
        <MenuGroup
          v-else
          :text="item.text"
          :items="item.items"
          :icon="item.icon"
        />
      </template>
    </div>

    <slot />
  </div>
</template>

<style scoped>
.menu-wrapper {
  min-width: 128px;
  max-height: calc(100vh - var(--vp-nav-height));
  padding: 12px;
  overflow-y: auto;
  background-color: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  box-shadow: var(--vp-shadow-3);
  transition: background-color 0.5s;
}

.menu-wrapper :deep(.group) {
  padding: 0 12px 12px;
  margin: 0 -12px;
}

.menu-wrapper :deep(.group + .group) {
  padding: 11px 12px 12px;
  border-top: 1px solid var(--vp-c-divider);
}

.menu-wrapper :deep(.group:last-child) {
  padding-bottom: 0;
}

.menu-wrapper :deep(.group + .item) {
  padding: 11px 16px 0;
  border-top: 1px solid var(--vp-c-divider);
}

.menu-wrapper :deep(.item) {
  padding: 0 16px;
  white-space: nowrap;
}

.menu-wrapper :deep(.label) {
  flex-grow: 1;
  font-size: 12px;
  font-weight: 500;
  line-height: 28px;
  color: var(--vp-c-text-2);
  transition: color 0.5s;
}

.menu-wrapper :deep(.action) {
  padding-left: 24px;
}
</style>
