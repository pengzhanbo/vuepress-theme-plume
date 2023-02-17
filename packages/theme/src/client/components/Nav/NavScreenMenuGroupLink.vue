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
    {{ text }}
  </AutoLink>
</template>

<style scoped>
.nav-screen-menu-group-link {
  display: block;
  margin-left: 12px;
  line-height: 32px;
  font-size: 14px;
  font-weight: 400;
  color: var(--vp-c-text-1);
  transition: color 0.25s;
}

.nav-screen-menu-group-link:hover {
  color: var(--vp-c-brand);
}
</style>
