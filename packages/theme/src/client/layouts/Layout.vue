<script setup lang="ts">
import Nav from '../components/Nav/index.vue'
import Page from '../components/Page.vue'
import { useScrollPromise, useThemeLocaleData } from '../composables/index.js'

// handle scrollBehavior with transition
const scrollPromise = useScrollPromise()
const onBeforeEnter = scrollPromise.resolve
const onBeforeLeave = scrollPromise.pending
</script>
<template>
  <div class="theme-plume">
    <Nav />
    <Page></Page>
  </div>
</template>

<style scoped>
.theme-plume {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
