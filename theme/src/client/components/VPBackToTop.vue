<script lang="ts" setup>
import { useElementSize, useWindowScroll, useWindowSize } from '@vueuse/core'
import { computed, onMounted, ref, shallowRef, watch } from 'vue'
import { useData } from '../composables/index.js'

import '@vuepress/helper/transition/fade-in.css'

const body = shallowRef<HTMLElement | null>()
const { height: bodyHeight } = useElementSize(body)
const { height: windowHeight } = useWindowSize()
onMounted(() => {
  body.value = document.body
})

const { page } = useData()

const { y } = useWindowScroll()
const isScrolling = ref(false)

const progress = computed(
  () => (y.value / (bodyHeight.value - windowHeight.value)) * 100,
)

// #72 back to top percentage issue
const percent = computed(() => `${Math.min(Math.round(progress.value), 100) || 0}%`)

const stroke = computed(() =>
  `calc(${Math.PI * progress.value}% - ${4 * Math.PI}px) calc(${Math.PI * 100}% - ${4 * Math.PI}px)`,
)

const mustHidden = computed(() => {
  return page.value.frontmatter.backToTop === false || (page.value.frontmatter.pageLayout === 'home' && page.value.frontmatter.config && (page.value.frontmatter.config as any).length <= 1)
})

const show = computed(() => {
  if (bodyHeight.value < windowHeight.value)
    return false

  else
    return y.value > windowHeight.value / 2
})

let timer: NodeJS.Timeout | null = null
function resetScrolling() {
  if (timer) {
    clearTimeout(timer)
  }
  timer = setTimeout(() => {
    isScrolling.value = false
  }, 1000)
}
watch(y, () => {
  isScrolling.value = true
  resetScrolling()
})

function handleClick() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <Transition name="fade-in">
    <button
      v-show="!mustHidden && (show || isScrolling)"
      type="button"
      class="vp-back-to-top"
      aria-label="back to top"
      @click="handleClick"
    >
      <span class="percent" :class="{ show: isScrolling }" data-allow-mismatch>{{ percent }}</span>
      <span class="icon vpi-back-to-top" :class="{ show: !isScrolling }" />
      <svg aria-hidden="true">
        <circle cx="50%" cy="50%" data-allow-mismatch :style="{ 'stroke-dasharray': stroke }" />
      </svg>
    </button>
  </Transition>
</template>

<style scoped>
.vp-back-to-top {
  position: fixed;
  inset-inline-end: 1rem;
  right: 24px;
  bottom: calc(var(--vp-footer-height, 82px) - 18px);
  z-index: var(--vp-z-index-back-to-top);
  width: 36px;
  height: 36px;
  background-color: var(--vp-c-bg);
  border-radius: 100%;
  box-shadow: var(--vp-shadow-2);
  transition:
    background-color var(--vp-t-color),
    box-shadow var(--vp-t-color);
}

.vp-back-to-top .percent,
.vp-back-to-top .icon {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  transition: opacity 0.5s ease, color var(--vp-t-color);
}

.vp-back-to-top .percent.show,
.vp-back-to-top .icon.show {
  opacity: 1;
}

.vp-back-to-top .percent {
  width: 100%;
  height: 100%;
  font-size: 10px;
  line-height: 36px;
  text-align: center;
  user-select: none;
}

.vp-back-to-top .icon {
  top: 50%;
  left: 50%;
  width: 18px;
  height: 18px;
  color: var(--vp-c-text-3);
  transform: translate(-50%, -50%);
}

.vp-back-to-top svg {
  width: 100%;
  height: 100%;
}

.vp-back-to-top svg circle {
  fill: none;
  r: 16px;
  stroke: var(--vp-c-brand-2);
  stroke-dasharray: 0% 314.1593%;
  stroke-width: 4px;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
}

@media (min-width: 768px) {
  .vp-back-to-top {
    bottom: calc(var(--vp-footer-height, 88px) - 24px);
    width: 48px;
    height: 48px;
  }

  .vp-back-to-top .percent {
    font-size: 14px;
    line-height: 48px;
  }

  .vp-back-to-top .icon {
    width: 24px;
    height: 24px;
  }

  .vp-back-to-top svg circle {
    r: 22px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media print {
  .vp-back-to-top {
    display: none;
  }
}
</style>
