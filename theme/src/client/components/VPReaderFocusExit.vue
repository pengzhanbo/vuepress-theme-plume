<script setup lang="ts">
import { onKeyStroke } from '@vueuse/core'
import { computed } from 'vue'
import { useData, useReaderPreferences } from '../composables/index.js'

import '@vuepress/helper/transition/fade-in.css'

const { theme } = useData()
const { options, prefs, setPreference } = useReaderPreferences()

/**
 * 只有功能启用且偏好开启时，专注模式才生效。
 */
const active = computed(() => options.value?.focusMode === true && prefs.value.focus === true)

function exit(): void {
  setPreference('focus', undefined)
}

onKeyStroke('Escape', () => {
  if (active.value)
    exit()
})
</script>

<template>
  <div class="vp-reader-focus-exit">
    <Transition name="fade-in">
      <button v-if="active" type="button" class="exit" @click="exit">
        <span class="vpi-chevron-down" aria-hidden="true" />
        {{ theme.readerFocusModeExitLabel ?? 'Exit focus mode' }}
      </button>
    </Transition>

    <span class="sr-only" role="status" aria-live="polite">{{ active ? (theme.readerFocusModeEnterText ?? '') : '' }}</span>
  </div>
</template>

<style scoped>
.exit {
  position: fixed;
  right: 24px;
  bottom: calc(env(safe-area-inset-bottom, 0px) + 24px);
  z-index: var(--vp-z-index-overlay);

  display: flex;
  gap: 6px;
  align-items: center;

  padding: 6px 14px 6px 10px;
  font-size: 12px;
  line-height: 20px;
  color: var(--vp-c-text-2);

  background-color: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  box-shadow: var(--vp-shadow-2);

  transition: color var(--vp-t-color), background-color var(--vp-t-color), border-color var(--vp-t-color);
}

.exit:hover {
  color: var(--vp-c-brand-1);
}

.exit > [class^="vpi-"] {
  width: 14px;
  height: 14px;
}
</style>
