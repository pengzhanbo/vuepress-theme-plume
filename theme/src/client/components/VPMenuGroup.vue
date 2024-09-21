<script lang="ts" setup>
import VPIcon from '@theme/VPIcon.vue'
import VPMenuLink from '@theme/VPMenuLink.vue'

defineProps<{
  text?: string
  icon?: string | { svg: string }
  items: any[]
}>()
</script>

<template>
  <div class="vp-menu-group">
    <p v-if="text" class="title">
      <VPIcon v-if="icon" :name="icon" />
      <span v-text="text" />
    </p>

    <template v-for="item in items">
      <VPMenuLink v-if="'link' in item" :key="item?.link" :item="item" />
    </template>
  </div>
</template>

<style scoped>
.vp-menu-group {
  padding: 12px 12px 0;
  margin: 12px -12px 0;
  border-top: 1px solid var(--vp-c-divider);
  transition: border-top var(--vp-t-color);
}

.vp-menu-group:first-child {
  padding-top: 0;
  margin-top: 0;
  border-top: 0;
}

.vp-menu-group + .vp-menu-group {
  margin-top: 12px;
  border-top: 1px solid var(--vp-c-divider);
}

.title {
  padding: 0 12px;
  font-size: 14px;
  font-weight: 600;
  line-height: 32px;
  color: var(--vp-c-text-2);
  transition: color var(--vp-t-color);
}

.title :deep(.vp-icon),
.title :deep(.vp-icon-img) {
  margin-left: 0;
}
</style>
