<script lang="ts" setup>
import type { ThemeHomeConfig } from 'theme/src/shared/index.js'
import { useElementSize, useWindowSize } from '@vueuse/core'
import { computed, onMounted, shallowRef } from 'vue'
import { useData } from '../composables/index.js'

const body = shallowRef<HTMLElement | null>()
const { height: bodyHeight } = useElementSize(body)
const { height: windowHeight } = useWindowSize()
onMounted(() => {
  body.value = document.body
})

const { page, isDark } = useData()

const mustHidden = computed(() => {
  if (page.value.frontmatter.signDown !== true || page.value.frontmatter.pageLayout !== 'home' || !page.value.frontmatter.config) {
    return true
  }
  const homeConfig = page.value.frontmatter.config as ThemeHomeConfig[]
  if (homeConfig.length <= 1 || homeConfig[0].full !== true) {
    return true
  }
  return false
})

const show = computed(() => {
  if (bodyHeight.value < windowHeight.value)
    return false
  else
    return true
})
</script>

<template>
  <svg v-show="!mustHidden && show" aria-label="sign down" class="vp-sign-down" :class="{ 'vp-sign-down-dark': isDark }" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <g fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">
      <path d="M16.884 5.348a1.25 1.25 0 0 1 0 1.768L12 12L7.116 7.116a1.25 1.25 0 0 1 1.768-1.768L12 8.464l3.116-3.116a1.25 1.25 0 0 1 1.768 0" />
      <path d="M16.884 12.366a1.25 1.25 0 0 1 0 1.768L12 19.018l-4.884-4.884a1.25 1.25 0 0 1 1.768-1.768L12 15.482l3.116-3.116a1.25 1.25 0 0 1 1.768 0" />
    </g>
  </svg>
</template>

<style scoped>
@keyframes top-bot {
  0%,
  100% {
    transform: translate(0, -15px);
  }

  50% {
    transform: translate(0, 0);
  }
}

.vp-sign-down {
  position: absolute;
  bottom: 8px;
  left: 50%;
  z-index: 100;
  width: 26px;
  height: 26px;
  color: white;
  opacity: 0.8;
  transform: translate(-50%, 0);
  animation: top-bot 3s infinite;
}

.vp-sign-down-dark {
  color: gray;
}

@media (min-width: 768px) {
  .vp-sign-down {
    bottom: 10px;
    width: 34px;
    height: 34px;
  }
}

@media print {
  .vp-sign-down {
    display: none;
  }
}
</style>
