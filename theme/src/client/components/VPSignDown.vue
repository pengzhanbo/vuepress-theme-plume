<script lang="ts" setup>
import { useElementSize, useWindowScroll, useWindowSize } from '@vueuse/core'
import { computed, onMounted, shallowRef } from 'vue'
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

const progress = computed(
  () => (y.value / (bodyHeight.value - windowHeight.value)) * 100,
)

const percent = computed(() => Math.min(Math.round(progress.value), 90) || 0)

const mustHidden = computed(() => {
  return page.value.frontmatter.signDown === undefined || page.value.frontmatter.signDown === false || (page.value.frontmatter.pageLayout === 'home' && page.value.frontmatter.config && (page.value.frontmatter.config as any).length <= 1)
})

const show = computed(() => {
  if (bodyHeight.value < windowHeight.value)
    return false
  else if (percent.value === 90)
    return false
  else
    return true
})
</script>

<template>
  <svg v-show="!mustHidden && show" aria-label="sign down" t="1755683953015" class="vp-sign-down" aria-hidden="true" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3080" width="48" height="48">
    <path d="M597.333 640V85.333c0-23.68-19.285-42.666-43.093-42.666h-84.48a42.667 42.667 0 0 0-43.093 42.666V640h-84.95c-47.232 0-62.805 30.55-34.56 68.267l153.643 204.8c28.501 37.973 74.112 37.717 102.4 0l153.6-204.8C745.301 670.293 729.6 640 682.283 640h-84.95z" fill="#333333" p-id="3081" />
  </svg>
</template>

<style scoped>
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.vp-sign-down {
  width: 22px;
  height: 22px;
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 100;
  animation: blink 1.2s infinite;
}

@media (min-width: 768px) {
  .vp-sign-down {
    bottom: 15px;
    width: 28px;
    height: 28px;
  }
}

@media print {
  .vp-sign-down {
    display: none;
  }
}
</style>
