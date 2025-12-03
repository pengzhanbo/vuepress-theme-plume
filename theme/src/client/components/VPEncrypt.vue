<script setup lang="ts">
import VPEncryptForm from '@theme/VPEncryptForm.vue'
import { useTemplateRef } from 'vue'
import { useData, useEncrypt } from '../composables/index.js'

defineOptions({
  inheritAttrs: false,
})

const { isPageDecrypted } = useEncrypt()

const { theme, frontmatter } = useData<'post'>()

const el = useTemplateRef<HTMLElement>('el')
function onValidate(isValidate: boolean) {
  if (!isValidate) {
    el.value?.classList.add('animation')
    setTimeout(() => {
      el.value?.classList.remove('animation')
    }, 800)
  }
}
</script>

<template>
  <ClientOnly v-if="!isPageDecrypted">
    <div ref="el" class="vp-page-encrypt" v-bind="$attrs">
      <div class="logo">
        <span class="vpi-lock icon-lock-head" />
      </div>
      <VPEncryptForm :info="frontmatter.passwordHint || theme.encryptPageText" @validate="onValidate" />
    </div>
  </ClientOnly>
  <slot v-else />
</template>

<style scoped>
.vp-page-encrypt {
  transition: var(--vp-t-color);
  transition-property: box-shadow, border-color, transform;
}

.vp-page-encrypt.animation {
  animation-name: encrypt-error;
  animation-duration: 0.15s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: 4;
}

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
    background: var(--vp-c-bg-soft);
    border-radius: 8px;
  }
}

@keyframes encrypt-error {
  0% {
    transform: translateX(0);
  }

  33% {
    transform: translateX(-4px);
  }

  67% {
    transform: translateX(4px);
  }

  100% {
    transform: translateX(0);
  }
}
</style>
