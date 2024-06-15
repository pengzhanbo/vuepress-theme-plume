<script lang="ts" setup>
import { inject } from 'vue'
import VPLink from '../VPLink.vue'
import VPIcon from '../VPIcon.vue'

defineProps<{
  text: string
  link: string
  icon?: string | { svg: string }
}>()

const closeScreen = inject('close-screen') as () => void
</script>

<template>
  <VPLink class="vp-nav-screen-menu-link" :href="link" @click="closeScreen">
    <VPIcon v-if="icon" :name="icon" />
    <i v-text="text" />
  </VPLink>
</template>

<style scoped>
.vp-nav-screen-menu-link {
  display: block;
  padding: 12px 0 11px;
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;
  color: var(--vp-c-text-1);
  border-bottom: 1px solid var(--vp-c-divider);
  transition:
    border-color var(--t-color),
    color var(--t-color);
}

.vp-nav-screen-menu-link:hover {
  color: var(--vp-c-brand-1);
}
</style>
