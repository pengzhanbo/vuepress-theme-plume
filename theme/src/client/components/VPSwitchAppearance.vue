<script lang="ts" setup>
import VPSwitch from '@theme/VPSwitch.vue'
import { computed, inject, nextTick, ref, watchPostEffect } from 'vue'
import { enableTransitions, useData } from '../composables/index.js'

const checked = ref(false)
const { theme, isDark } = useData()

const transitionMode = computed(() => {
  const transition = theme.value.transition
  const options = typeof transition === 'object' ? transition : {}
  if (transition === false || options.appearance === false)
    return false

  return typeof options.appearance === 'string' ? options.appearance : 'fade'
})

const toggleAppearance = inject('toggle-appearance', async ({ clientX: x, clientY: y }: MouseEvent) => {
  if (!enableTransitions() || transitionMode.value === false) {
    isDark.value = !isDark.value
    return
  }

  await document.startViewTransition(async () => {
    isDark.value = !isDark.value
    await nextTick()
  }).ready

  const keyframes: PropertyIndexedKeyframes = {}
  const mode = transitionMode.value
  let duration = 400

  if (mode === 'circle-clip') {
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${Math.hypot(
        Math.max(x, innerWidth - x),
        Math.max(y, innerHeight - y),
      )}px at ${x}px ${y}px)`,
    ]
    keyframes.clipPath = isDark.value ? clipPath.reverse() : clipPath
  }
  else if (mode === 'horizontal-clip') {
    const clipPath = [
      `inset(0px ${innerWidth}px 0px 0px)`,
      `inset(0px 0px 0px 0px)`,
    ]
    keyframes.clipPath = isDark.value ? clipPath.reverse() : clipPath
  }
  else if (mode === 'vertical-clip') {
    const clipPath = [
      `inset(0px 0px ${innerHeight}px 0px)`,
      `inset(0px 0px 0px 0px)`,
    ]
    keyframes.clipPath = isDark.value ? clipPath.reverse() : clipPath
  }
  else if (mode === 'skew-clip') {
    const clipPath = [
      'polygon(0px 0px, 0px 0px, 0px 0px)',
      `polygon(0px 0px, ${innerWidth * 2}px 0px, 0px ${innerHeight * 2}px)`,
    ]
    keyframes.clipPath = isDark.value ? clipPath.reverse() : clipPath
  }
  else {
    keyframes.opacity = isDark.value ? [1, 0] : [0, 1]
    duration = 300
  }

  document.documentElement.animate(
    keyframes,
    {
      duration,
      easing: 'ease-in',
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
  <VPSwitch
    class="vp-switch-appearance"
    :title="switchTitle"
    :aria-checked="checked"
    @click="toggleAppearance"
  >
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
::view-transition-old(root),
::view-transition-new(root) {
  mix-blend-mode: normal;
  animation: none;
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
