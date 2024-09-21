<script lang="ts" setup>
import VPMenuGroup from '@theme/VPMenuGroup.vue'
import VPMenuLink from '@theme/VPMenuLink.vue'

defineProps<{
  items?: any[]
}>()
</script>

<template>
  <div class="vp-menu">
    <div v-if="items" class="items">
      <template v-for="item in items" :key="item.text">
        <VPMenuLink v-if="'link' in item" :item="item" />
        <VPMenuGroup
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
.vp-menu {
  min-width: 128px;
  max-height: calc(100vh - var(--vp-nav-height));
  padding: 12px;
  overflow-y: auto;
  background-color: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  box-shadow: var(--vp-shadow-3);
  transition: background-color var(--vp-t-color), border var(--vp-t-color);
}

.vp-menu :deep(.group) {
  padding: 0 12px 12px;
  margin: 0 -12px;
}

.vp-menu :deep(.group + .group) {
  padding: 11px 12px 12px;
  border-top: 1px solid var(--vp-c-divider);
  transition: border-top var(--vp-t-color);
}

.vp-menu :deep(.group:last-child) {
  padding-bottom: 0;
}

.vp-menu :deep(.group + .item) {
  padding: 11px 16px 0;
  border-top: 1px solid var(--vp-c-divider);
  transition: border-top var(--vp-t-color);
}

.vp-menu :deep(.item) {
  padding: 0 16px;
  white-space: nowrap;
}

.vp-menu :deep(.label) {
  flex-grow: 1;
  font-size: 12px;
  font-weight: 500;
  line-height: 28px;
  color: var(--vp-c-text-2);
  transition: color var(--vp-t-color);
}

.vp-menu :deep(.action) {
  padding-left: 24px;
}
</style>
