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
  border-bottom: 1px solid var(--vp-c-divider);
  padding: 12px 0 11px;
  line-height: 24px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  transition: border-color 0.25s, color 0.25s;
}

.nav-screen-menu-link:hover {
  color: var(--vp-c-brand-1);
}
</style>
