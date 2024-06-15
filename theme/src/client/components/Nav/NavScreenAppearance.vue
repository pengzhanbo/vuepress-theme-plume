<script lang="ts" setup>
import { useData } from '../../composables/data.js'
import VPSwitchAppearance from '../VPSwitchAppearance.vue'

const { theme } = useData()
</script>

<template>
  <div
    v-if="theme.appearance && theme.appearance !== 'force-dark'"
    class="nav-screen-appearance"
  >
    <p class="text">
      {{ theme.appearanceText ?? 'Appearance' }}
    </p>
    <VPSwitchAppearance />
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
