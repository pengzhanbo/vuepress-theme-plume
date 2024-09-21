<script lang="ts" setup>
import VPSwitchAppearance from '@theme/VPSwitchAppearance.vue'
import { useData } from '../../composables/index.js'

const { theme } = useData()
</script>

<template>
  <div
    v-if="theme.appearance && theme.appearance !== 'force-dark'"
    class="vp-nav-screen-appearance"
  >
    <p class="text">
      {{ theme.appearanceText ?? 'Appearance' }}
    </p>
    <VPSwitchAppearance />
  </div>
</template>

<style scoped>
.vp-nav-screen-appearance {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px 12px 16px;
  background-color: var(--vp-c-bg-soft);
  border-radius: 8px;
  transition: var(--vp-t-color);
  transition-property: background-color;
}

.text {
  font-size: 12px;
  font-weight: 500;
  line-height: 24px;
  color: var(--vp-c-text-2);
}
</style>
