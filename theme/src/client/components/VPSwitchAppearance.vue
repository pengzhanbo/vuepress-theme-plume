<script lang="ts" setup>
import VPSwitch from '@theme/VPSwitch.vue'
import { computed, inject, nextTick, ref, watchPostEffect } from 'vue'
import { enableTransitions, resolveTransitionKeyframes, useData } from '../composables/index.js'

const checked = ref(false)
const { theme, isDark } = useData()

const transitionMode = computed(() => {
  const transition = theme.value.transition
  const options = typeof transition === 'object' ? transition : {}
  if (transition === false || options.appearance === false)
    return false

  return typeof options.appearance === 'string' ? options.appearance : 'fade'
})

const toggleAppearance = inject('toggle-appearance', async ({ clientX, clientY }: MouseEvent) => {
  if (!enableTransitions() || transitionMode.value === false) {
    isDark.value = !isDark.value
    return
  }

  await document.startViewTransition(async () => {
    isDark.value = !isDark.value
    await nextTick()
  }).ready

  const { keyframes, duration } = resolveTransitionKeyframes(
    clientX,
    clientY,
    transitionMode.value,
    isDark.value,
  )

  document.documentElement.animate(
    keyframes,
    {
      duration,
      easing: 'ease-in',
      fill: 'forwards',
      pseudoElement: `::view-transition-${isDark.value ? 'old' : 'new'}(root)`,
    },
  )
})

const switchTitle = ref('')
watchPostEffect(() => {
  switchTitle.value = isDark.value
    ? theme.value.lightModeSwitchTitle || 'Switch to light theme'
    : theme.value.darkModeSwitchTitle || 'Switch to dark theme'
})
</script>

<template>
  <VPSwitch class="vp-switch-appearance" :title="switchTitle" :aria-checked="checked" @click="toggleAppearance">
    <span class="vpi-sun sun" />
    <span class="vpi-moon moon" />
  </VPSwitch>
</template>

<style scoped>
.sun {
  opacity: 1;
}

.moon {
  opacity: 0;
}

[data-theme="dark"] .sun {
  opacity: 0;
}

[data-theme="dark"] .moon {
  opacity: 1;
}

[data-theme="dark"] .vp-switch-appearance :deep(.check) {
  /* rtl:ignore */
  transform: translateX(18px);
}
</style>

<style>
::view-transition-image-pair(root) {
  isolation: auto;
}

::view-transition-group(root) {
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

::view-transition-old(root),
::view-transition-new(root) {
  clip-path: none;
  mix-blend-mode: normal;
  mask: none;
  transition: none !important;
  animation: none !important;
}

::view-transition-old(root),
[data-theme="dark"]::view-transition-new(root) {
  z-index: 1;
}

::view-transition-new(root),
[data-theme="dark"]::view-transition-old(root) {
  z-index: 9999;
}
</style>
