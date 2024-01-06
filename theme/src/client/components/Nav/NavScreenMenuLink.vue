<script lang="ts" setup>
import { inject } from 'vue'
import AutoLink from '../AutoLink.vue'

defineProps<{
  text: string
  link: string
  icon?: string
}>()

const closeScreen = inject('close-screen') as () => void
</script>

<template>
  <AutoLink class="nav-screen-menu-link" :href="link" @click="closeScreen">
    <Icon v-if="icon" :name="icon" />
    <i v-text="text" />
  </AutoLink>
</template>

<style scoped>
.nav-screen-menu-link {
  display: block;
  padding: 12px 0 11px;
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;
  color: var(--vp-c-text-1);
  border-bottom: 1px solid var(--vp-c-divider);
  transition:
    border-color 0.25s,
    color 0.25s;
}

.nav-screen-menu-link:hover {
  color: var(--vp-c-brand-1);
}
</style>
