<script lang="ts" setup>
import VPSwitch from '@theme/VPSwitch.vue'
import { inject, ref, watchPostEffect } from 'vue'
import { useData } from '../composables/index.js'

const checked = ref(false)
const { theme, isDark } = useData()

const toggleAppearance = inject('toggle-appearance', () => {
  isDark.value = !isDark.value
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
