<script lang="ts" setup>
import { debounce } from 'ts-debounce'
import { onMounted, ref } from 'vue'
import { getScrollTop, scrollTo } from '../utils'
import { BackTopIcon } from './icons'

const opacity = ref<number>(0)
const MAX_TOP = 300

const canShow = debounce((): void => {
  opacity.value = getScrollTop(document) >= MAX_TOP ? 1 : 0
})

const scrollToTop = (): void => {
  scrollTo(document, 0)
}

onMounted(() => {
  canShow()
  window.addEventListener('scroll', () => canShow(), false)
})
</script>
<template>
  <div class="btn-back-top" :style="{ opacity: opacity }" @click="scrollToTop">
    <BackTopIcon />
  </div>
</template>
<style lang="scss">
@import '../styles/variables';
.btn-back-top {
  position: fixed;
  right: 3rem;
  bottom: 4.35rem;
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
@media (max-width: $MQMobile) {
  .btn-back-top {
    right: 1.25rem;
    bottom: 2rem;
  }
}
</style>
