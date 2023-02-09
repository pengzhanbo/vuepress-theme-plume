<script setup lang="ts">
import Nav from '../components/Nav/index.vue'
import { useScrollPromise, useThemeLocaleData } from '../composables/index.js'

// handle scrollBehavior with transition
const scrollPromise = useScrollPromise()
const onBeforeEnter = scrollPromise.resolve
const onBeforeLeave = scrollPromise.pending
</script>
<template>
  <div class="theme-plume relative min-h-100vh">
    <Nav />
  </div>
</template>
