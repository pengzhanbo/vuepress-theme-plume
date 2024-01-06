<script lang="ts" setup>
import { useThemeLocaleData } from '../../composables/index.js'
import SwitchAppearance from '../SwitchAppearance.vue'

const theme = useThemeLocaleData()
</script>

<template>
  <div v-if="theme.appearance" class="nav-screen-appearance">
    <p class="text">
      Appearance
    </p>
    <SwitchAppearance />
  </div>
</template>

<style scoped>
.nav-screen-appearance {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px 12px 16px;
  background-color: var(--vp-c-bg-soft);
  border-radius: 8px;
  transition: var(--t-color);
  transition-property: background-color;
}

.text {
  font-size: 12px;
  font-weight: 500;
  line-height: 24px;
  color: var(--vp-c-text-2);
}
</style>
