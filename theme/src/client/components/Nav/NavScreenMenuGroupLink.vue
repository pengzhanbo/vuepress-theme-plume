<script lang="ts" setup>
import { inject } from 'vue'
import AutoLink from '../AutoLink.vue'

defineProps<{
  icon?: string
  text: string
  link: string
}>()

const closeScreen = inject('close-screen') as () => void
</script>

<template>
  <AutoLink
    class="nav-screen-menu-group-link"
    :href="link"
    @click="closeScreen"
  >
    <Icon v-if="icon" :name="icon" />
    <i v-text="text" />
  </AutoLink>
</template>

<style scoped>
.nav-screen-menu-group-link {
  display: block;
  margin-left: 12px;
  font-size: 14px;
  font-weight: 400;
  line-height: 32px;
  color: var(--vp-c-text-1);
  transition: color var(--t-color);
}

.nav-screen-menu-group-link:hover {
  color: var(--vp-c-brand-1);
}
</style>
