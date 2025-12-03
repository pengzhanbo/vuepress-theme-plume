<script setup lang="ts">
import VPEncrypt from '@theme/VPEncrypt.vue'
</script>

<template>
  <div class="vp-page">
    <VPEncrypt>
      <slot name="page-top" />
      <Content class="vp-doc plume-content" vp-content />
      <slot name="page-bottom" />
    </VPEncrypt>
  </div>
</template>
