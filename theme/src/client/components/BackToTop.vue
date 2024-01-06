<script lang="ts" setup>
import { useElementSize, useWindowScroll, useWindowSize } from '@vueuse/core'
import { computed, onMounted, ref, shallowRef, watch } from 'vue'
import { usePageData } from '@vuepress/client'
import type { PlumeThemePageData } from '../../shared/index.js'
import IconBackToTop from './icons/IconBackToTop.vue'

const body = shallowRef<HTMLElement | null>()
const { height: bodyHeight } = useElementSize(body)
const { height: windowHeight } = useWindowSize()
onMounted(() => {
  body.value = document.body
})

const page = usePageData<PlumeThemePageData>()

const { y } = useWindowScroll()
const isScrolling = ref(false)

const progress = computed(
  () => (y.value / (bodyHeight.value - windowHeight.value)) * 100,
)
const percent = computed(() => `${Math.round(progress.value) || 0}%`)

const stroke = computed(() =>
  `calc(${Math.PI * progress.value}% - ${4 * Math.PI}px) calc(${Math.PI * 100}% - ${4 * Math.PI}px)`,
)

const mustHidden = computed(() => {
  return page.value.frontmatter.backToTop === false || page.value.frontmatter.home
})

const show = computed(() => {
  if (bodyHeight.value < windowHeight.value)
    return false

  else
    return y.value > windowHeight.value / 2
})

let timer: NodeJS.Timeout | null = null
function resetScrolling() {
  timer && clearTimeout(timer)
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
  <Transition name="fade">
    <button
      v-show="!mustHidden && (show || isScrolling)"
      type="button"
      class="back-to-top-button"
      aria-label="back to top"
      @click="handleClick"
    >
      <span class="percent" :class="{ show: isScrolling }">{{ percent }}</span>
      <IconBackToTop class="icon" :class="{ show: !isScrolling }" />
      <svg aria-hidden="true">
        <circle cx="50%" cy="50%" :style="{ 'stroke-dasharray': stroke }" />
      </svg>
    </button>
  </Transition>
</template>

<style scoped>
.back-to-top-button {
  position: fixed;
  inset-inline-end: 1rem;
  right: 20px;
  bottom: 64px;
  z-index: var(--vp-z-index-back-to-top);
  width: 36px;
  height: 36px;
  background-color: var(--vp-c-bg);
  border-radius: 100%;
  box-shadow: var(--vp-shadow-2);
  transition:
    background-color 0.25s ease,
    box-shadow 0.25s ease;
}

.back-to-top-button .percent,
.back-to-top-button .icon {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.back-to-top-button .percent.show,
.back-to-top-button .icon.show {
  opacity: 1;
}

.back-to-top-button .percent {
  width: 100%;
  height: 100%;
  font-size: 10px;
  line-height: 36px;
  text-align: center;
  user-select: none;
}

.back-to-top-button .icon {
  top: 50%;
  left: 50%;
  width: 18px;
  height: 18px;
  color: var(--vp-c-text-3);
  transform: translate(-50%, -50%);
}

.back-to-top-button svg {
  width: 100%;
  height: 100%;
}

.back-to-top-button svg circle {
  fill: none;
  stroke: var(--vp-c-brand-2);
  stroke-dasharray: 0% 314.1593%;
  stroke-width: 4px;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
  r: 16;
}

@media (width >= 768px) {
  .back-to-top-button {
    width: 48px;
    height: 48px;
  }

  .back-to-top-button .percent {
    font-size: 14px;
    line-height: 48px;
  }

  .back-to-top-button .icon {
    width: 24px;
    height: 24px;
  }

  .back-to-top-button svg circle {
    r: 22;
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
  .back-to-top-button {
    display: none;
  }
}
</style>
