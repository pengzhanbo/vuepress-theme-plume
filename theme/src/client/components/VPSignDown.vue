<script lang="ts" setup>
import type { ThemeHomeConfig } from '../../shared/index.js'
import { useElementSize, useWindowSize } from '@vueuse/core'
import { computed, onMounted, shallowRef } from 'vue'
import { useData, useLayout } from '../composables/index.js'

const body = shallowRef<HTMLElement | null>()
const { height: bodyHeight } = useElementSize(body)
const { height: windowHeight } = useWindowSize()
onMounted(() => {
  body.value = document.body
})

const { page, theme } = useData()

const label = computed(() => theme.value.scrollDownLabel || 'Scroll down')

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

const { is960 } = useLayout()

function onClick() {
  document.documentElement.scrollTo({
    top: document.documentElement.clientHeight - (is960.value ? 64 : 0),
    behavior: 'smooth',
  })
}
</script>

<template>
  <button
    v-show="!mustHidden && show"
    type="button"
    class="vp-sign-down"
    :aria-label="label"
    @click="onClick"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5">
        <path d="m19 11l-7 6l-7-6" />
        <path d="m19 5l-7 6l-7-6" opacity="0.6" />
      </g>
    </svg>
  </button>
</template>

<style scoped>
@keyframes vp-sign-down {
  0% {
    opacity: 0.5;
    transform: translate(-50%, -12px);
  }

  100% {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

.vp-sign-down {
  position: absolute;
  bottom: 8px;
  left: 50%;
  z-index: 29;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  color: #fff;
  cursor: pointer;
  background: none;
  border: none;
  transform: translate(-50%, 0);
  animation: vp-sign-down 1.75s infinite alternate ease-out;
}

.vp-sign-down svg {
  width: 100%;
  height: 100%;
}

[data-theme="dark"] .vp-sign-down {
  color: var(--vp-c-text-2);
}

@media (min-width: 768px) {
  .vp-sign-down {
    bottom: 10px;
    width: 30px;
    height: 30px;
  }
}

@media print {
  .vp-sign-down {
    display: none;
  }
}
</style>
