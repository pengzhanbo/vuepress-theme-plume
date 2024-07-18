<script lang="ts" setup>
import VPSwitchAppearance from '@theme/VPSwitchAppearance.vue'
import { useData } from '../../composables/index.js'

const { theme } = useData()
</script>

<template>
  <div
    v-if="theme.appearance && theme.appearance !== 'force-dark'"
    class="vp-navbar-appearance"
  >
    <VPSwitchAppearance />
  </div>
</template>

<style scoped>
.vp-navbar-appearance {
  display: none;
}

@media (min-width: 1280px) {
  .vp-navbar-appearance {
    display: flex;
    align-items: center;
  }
}
</style>
