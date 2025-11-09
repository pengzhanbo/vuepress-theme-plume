<script setup lang="ts">
import VPEncryptPage from '@theme/VPEncryptPage.vue'
import { useEncrypt } from '../composables/index.js'

const { isPageDecrypted } = useEncrypt()
</script>

<template>
  <div class="vp-page">
    <VPEncryptPage v-if="!isPageDecrypted" />
    <template v-else>
      <slot name="page-top" />
      <Content class="vp-doc plume-content" vp-content />
      <slot name="page-bottom" />
    </template>
  </div>
</template>
