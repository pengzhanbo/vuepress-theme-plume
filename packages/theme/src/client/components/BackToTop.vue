<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { scrollTo } from '../utils'
import { BackTopIcon } from './icons'

const opacity = ref<number>(0)
const MAX_TOP = 300

const canShow = (): void => {
  if (__VUEPRESS_SSR__) return
  opacity.value = document.documentElement.scrollTop >= MAX_TOP ? 1 : 0
}

const scrollToTop = (): void => {
  scrollTo(document, 0)
}

onMounted(() => {
  if (__VUEPRESS_SSR__) return
  canShow()
  window.addEventListener('scroll', canShow, false)
})

onUnmounted(() => {
  if (__VUEPRESS_SSR__) return
  window.removeEventListener('scroll', canShow)
})
</script>
<template>
  <div class="btn-back-top" :style="{ opacity: opacity }" @click="scrollToTop">
    <BackTopIcon />
  </div>
</template>
<style lang="scss">
.btn-back-top {
  position: fixed;
  right: 3rem;
  bottom: 3rem;
  width: 3rem;
  height: 3rem;
  text-align: center;
  padding: 0.75rem 0;
  border-radius: 50%;
  background-color: var(--c-bg-container);
  box-shadow: var(--shadow-md);
  cursor: pointer;
  transition: opacity var(--t-color);
  z-index: 99;

  .back-top-icon {
    width: 1.75rem;
    height: 1.75rem;
    color: var(--c-brand);
    transition: color var(--t-color);
  }

  &:hover {
    .back-top-icon {
      color: var(--c-brand-light);
    }
  }
}
</style>
