<script lang="ts" setup>
import { inject } from 'vue'
import VPLink from '../VPLink.vue'
import VPIcon from '../VPIcon.vue'

defineProps<{
  icon?: string | { svg: string }
  text: string
  link: string
}>()

const closeScreen = inject('close-screen') as () => void
</script>

<template>
  <VPLink
    class="vp-nav-screen-menu-group-link"
    :href="link"
    @click="closeScreen"
  >
    <VPIcon v-if="icon" :name="icon" />
    <i v-text="text" />
  </VPLink>
</template>

<style scoped>
.vp-nav-screen-menu-group-link {
  display: block;
  margin-left: 12px;
  font-size: 14px;
  font-weight: 400;
  line-height: 32px;
  color: var(--vp-c-text-1);
  transition: color var(--t-color);
}

.vp-nav-screen-menu-group-link:hover {
  color: var(--vp-c-brand-1);
}
</style>
