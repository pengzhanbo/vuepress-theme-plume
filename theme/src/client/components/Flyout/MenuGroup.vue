<script lang="ts" setup>
import MenuLink from './MenuLink.vue'

defineProps<{
  text?: string
  icon?: string
  items: any[]
}>()
</script>

<template>
  <div class="menu-group">
    <p v-if="text" class="title">
      <Icon v-if="icon" :name="icon" />
      <span v-text="text" />
    </p>

    <template v-for="item in items">
      <MenuLink v-if="'link' in item" :key="item?.link" :item="item" />
    </template>
  </div>
</template>

<style scoped>
.menu-group {
  padding: 12px 12px 0;
  margin: 12px -12px 0;
  border-top: 1px solid var(--vp-c-divider);
  transition: border-top var(--t-color);
}

.menu-group:first-child {
  padding-top: 0;
  margin-top: 0;
  border-top: 0;
}

.menu-group + .menu-group {
  margin-top: 12px;
  border-top: 1px solid var(--vp-c-divider);
}

.title {
  padding: 0 12px;
  font-size: 14px;
  font-weight: 600;
  line-height: 32px;
  color: var(--vp-c-text-2);
  transition: color var(--t-color);
}
</style>
