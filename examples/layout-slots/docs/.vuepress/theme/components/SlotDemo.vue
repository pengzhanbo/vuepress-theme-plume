<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { useMessage } from '../composables/message.js'
import '@vuepress/helper/message.css'

withDefaults(defineProps<{
  name: string
  w?: number
  h?: number
  mt?: number
  small?: boolean
}>(), {
  h: 60,
})

const message = useMessage()

const { copy } = useClipboard()

function onCopy(name: string) {
  copy(name)
  message.pop(`<span>复制成功: ${name}</span>`, 3000, true)
}
</script>

<template>
  <div
    class="slot-demo"
    :class="{ [name]: true, small }"
    :style="{ width: `${w}px`, height: `${h}px`, marginTop: `${mt}px` }"
    :title="name"
    @click="() => onCopy(name)"
  >
    <span>{{ name }}</span>
  </div>
</template>

<style scoped>
.slot-demo {
  --slot-demo-bg-1: #ddd;
  --slot-demo-bg-2: #eee;

  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  max-height: 100%;
  padding: 0 8px;
  background:
    repeating-linear-gradient(
      -45deg,
      var(--slot-demo-bg-1) 0,
      var(--slot-demo-bg-2) 1px,
      var(--slot-demo-bg-2) 0.4em,
      var(--slot-demo-bg-1) calc(0.25em + 1px),
      var(--slot-demo-bg-1) 0.75em
    );
  border-radius: 6px;
}

[data-theme="dark"] .slot-demo {
  --slot-demo-bg-1: #333;
  --slot-demo-bg-2: #444;
}

.slot-demo.small {
  font-size: 12px !important;
}

.slot-demo span {
  overflow: hidden;
  text-overflow: ellipsis;
}

.slot-demo.layout-top {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
}

.slot-demo.nav-bar-content-before,
.slot-demo.nav-bar-content-after,
.slot-demo.nav-bar-menu-before,
.slot-demo.nav-bar-menu-after {
  display: none;
}

@media (min-width: 768px) {
  .slot-demo.nav-bar-content-before,
  .slot-demo.nav-bar-content-after,
  .slot-demo.nav-bar-menu-before,
  .slot-demo.nav-bar-menu-after {
    display: flex;
  }
}

:global(#message-container) {
  inset: unset !important;
  top: calc(var(--vp-nav-height) + var(--vp-layout-top-height) + 24px) !important;
  left: 50% !important;
  width: fit-content !important;
  transform: translateX(-50%) !important;
}

:global(.message-item) {
  box-shadow: var(--vp-shadow-3);
}
</style>
