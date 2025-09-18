<script setup lang="ts">
import VPEncryptForm from '@theme/VPEncryptForm.vue'
import { useData } from '../composables/index.js'

defineOptions({
  inheritAttrs: false,
})

const { theme, frontmatter } = useData<'post'>()
</script>

<template>
  <ClientOnly>
    <div class="vp-page-encrypt" v-bind="$attrs">
      <div class="logo">
        <span class="vpi-lock icon-lock-head" />
      </div>
      <VPEncryptForm :info="frontmatter.passwordHint || theme.encryptPageText" />
    </div>
  </ClientOnly>
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
    border: solid 1px var(--vp-c-divider);
    border-radius: 8px;
    box-shadow: var(--vp-shadow-1);
    transition: var(--vp-t-color);
    transition-property: box-shadow, border-color;
  }

  .vp-page-encrypt:hover {
    box-shadow: var(--vp-shadow-2);
  }
}
</style>
