<script setup lang="ts">
import { useReadAid } from '../composables/index.js'

import '@vuepress/helper/transition/fade-in.css'

const { isOutside, style, readAid } = useReadAid()
</script>

<template>
  <Transition name="fade-in">
    <div v-show="!isOutside" class="vp-read-aid" :class="{ [readAid]: true }" :style="style" />
  </Transition>
</template>

<style scoped>
.vp-read-aid {
  position: absolute;
  top: 0;
  height: 0;
  background-color: var(--vp-read-aid-line-color);
  transition: transform var(--vp-t-color), height var(--vp-t-color);
  will-change: transform, height, width;
}

.vp-read-aid.left {
  left: -24px;
  width: var(--vp-read-aid-line-width);
  border-top-left-radius: var(--vp-read-aid-radius);
  border-bottom-left-radius: var(--vp-read-aid-radius);
}

.vp-read-aid.right {
  right: -18px;
  width: var(--vp-read-aid-line-width);
  border-top-right-radius: var(--vp-read-aid-radius);
  border-bottom-right-radius: var(--vp-read-aid-radius);
}

.vp-read-aid.mask {
  left: -8px;
  z-index: calc(var(--vp-z-index-local-nav) - 1);
  pointer-events: none;
  user-select: none;
  background-color: var(--vp-read-aid-mask-color);
  border-radius: var(--vp-read-aid-radius);
}
</style>
