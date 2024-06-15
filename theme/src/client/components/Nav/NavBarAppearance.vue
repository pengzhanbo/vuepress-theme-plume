<script lang="ts" setup>
import { useData } from '../../composables/data.js'
import VPSwitchAppearance from '../VPSwitchAppearance.vue'

const { theme } = useData()
</script>

<template>
  <div
    v-if="theme.appearance && theme.appearance !== 'force-dark'"
    class="navbar-appearance"
  >
    <VPSwitchAppearance />
  </div>
</template>

<style scoped>
.navbar-appearance {
  display: none;
}

@media (min-width: 1280px) {
  .navbar-appearance {
    display: flex;
    align-items: center;
  }
}
</style>
