<script setup lang="ts">
import VPDocAsideOutline from '@theme/VPDocAsideOutline.vue'
</script>

<template>
  <div class="vp-doc-aside">
    <slot name="aside-top" />

    <slot name="aside-outline-before" />
    <VPDocAsideOutline />
    <slot name="aside-outline-after" />

    <div class="spacer" />

    <slot name="aside-bottom" />
  </div>
</template>

<style scoped>
.vp-doc-aside {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.spacer {
  flex-grow: 1;
}
</style>
