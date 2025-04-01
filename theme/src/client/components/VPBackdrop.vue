<script lang="ts" setup>
import '@vuepress/helper/transition/fade-in.css'

defineProps<{
  show: boolean
}>()
</script>

<template>
  <Transition name="fade-in">
    <div v-if="show" class="vp-backdrop" />
  </Transition>
</template>

<style scoped>
.vp-backdrop {
  position: fixed;
  top: 0;

  /* rtl:ignore */
  right: 0;
  bottom: 0;

  /* rtl:ignore */
  left: 0;
  z-index: var(--vp-z-index-backdrop);
  background: var(--vp-backdrop-bg-color);
  transition: opacity var(--vp-t-color);
}

.vp-backdrop.fade-enter-from,
.vp-backdrop.fade-leave-to {
  opacity: 0;
}

.vp-backdrop.fade-leave-active {
  transition-duration: 0.25s;
}

@media (min-width: 1280px) {
  .vp-backdrop {
    display: none;
  }
}
</style>
