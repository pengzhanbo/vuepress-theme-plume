<script setup lang="ts">
import Navbar from '../components/Navbar/index.vue'
import { useScrollPromise, useThemeLocaleData } from '../composables/index.js'

// handle scrollBehavior with transition
const scrollPromise = useScrollPromise()
const onBeforeEnter = scrollPromise.resolve
const onBeforeLeave = scrollPromise.pending
</script>
<template>
  <div class="theme-plume relative min-h-100vh">
    <Navbar />
  </div>
</template>
