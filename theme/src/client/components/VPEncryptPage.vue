<script setup lang="ts">
import { usePageEncrypt } from '../composables/encrypt.js'
import { useData } from '../composables/data.js'
import VPEncryptForm from './VPEncryptForm.vue'

const { theme } = useData()
const { comparePage } = usePageEncrypt()
</script>

<template>
  <div class="vp-page-encrypt">
    <div class="logo">
      <span class="vpi-lock icon-lock-head" />
    </div>
    <VPEncryptForm :compare="comparePage" :info="theme.encryptPageText" />
  </div>
</template>

<style scoped>
.vp-page-encrypt .logo {
  text-align: center;
}

.icon-lock-head {
  display: inline-block;
  width: 64px;
  height: 64px;
  margin: auto;
}

@media (min-width: 768px) {
  .vp-page-encrypt {
    width: 400px;
    padding: 20px;
    margin: 40px auto 0;
    background-color: var(--vp-c-bg-alt);
    border-radius: 8px;
    box-shadow: var(--vp-shadow-2);
    transition: var(--t-color);
    transition-property: box-shadow, background-color;
  }
}
</style>
