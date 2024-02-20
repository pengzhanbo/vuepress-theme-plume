<script lang="ts" setup>
import { useThemeLocaleData } from '../../composables/index.js'
import SwitchAppearance from '../SwitchAppearance.vue'

const theme = useThemeLocaleData()
</script>

<template>
  <div
    v-if="theme.appearance && theme.appearance !== 'force-dark'"
    class="navbar-appearance"
  >
    <SwitchAppearance />
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
