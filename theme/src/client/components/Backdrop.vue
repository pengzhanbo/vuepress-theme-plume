<script lang="ts" setup>
defineProps<{
  show: boolean
}>()
</script>

<template>
  <Transition name="fade">
    <div v-if="show" class="backdrop" />
  </Transition>
</template>

<style scoped>
.backdrop {
  position: fixed;
  top: 0;

  /* rtl:ignore */
  right: 0;
  bottom: 0;

  /* rtl:ignore */
  left: 0;
  z-index: var(--vp-z-index-backdrop);
  background: var(--vp-backdrop-bg-color);
  transition: opacity var(--t-color);
}

.backdrop.fade-enter-from,
.backdrop.fade-leave-to {
  opacity: 0;
}

.backdrop.fade-leave-active {
  transition-duration: 0.25s;
}

@media (min-width: 1280px) {
  .backdrop {
    display: none;
  }
}
</style>
