<script lang="ts" setup>
import { computed, inject, ref } from 'vue'
import { useData } from '../composables/data.js'
import Switch from './Switch.vue'

const checked = ref(false)
const { theme, isDark } = useData()

const toggleAppearance = inject('toggle-appearance', () => {
  isDark.value = !isDark.value
})

const switchTitle = computed(() => {
  return isDark.value
    ? theme.value.lightModeSwitchTitle || 'Switch to light theme'
    : theme.value.darkModeSwitchTitle || 'Switch to dark theme'
})
</script>

<template>
  <Switch
    class="switch-appearance"
    :title="switchTitle"
    :aria-checked="checked"
    @click="toggleAppearance"
  >
    <span class="vpi-sun sun" />
    <span class="vpi-moon moon" />
  </Switch>
</template>

<style scoped>
.sun {
  opacity: 1;
}

.moon {
  opacity: 0;
}

.dark .sun {
  opacity: 0;
}

.dark .moon {
  opacity: 1;
}

.dark .switch-appearance :deep(.check) {
  /* rtl:ignore */
  transform: translateX(18px);
}
</style>
