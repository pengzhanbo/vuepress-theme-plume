<script setup lang="ts">
import { useTimeoutFn } from '@vueuse/core'
import { computed, watch } from 'vue'
import { useData, useReaderPreferences, useResumeReading } from '../composables/index.js'

import '@vuepress/helper/transition/fade-in.css'

/**
 * 自动消失的延迟。鼠标停留在提示条上时暂停计时。
 */
const LIFETIME = 8000

const { theme } = useData()
const { options } = useReaderPreferences()
const { saved, visible, resume, restart } = useResumeReading()

const percent = computed(() => Math.round((saved.value ?? 0) * 100))
const text = computed(() =>
  (theme.value.readerResumeText ?? 'Last read {percent}%').replace('{percent}', String(percent.value)),
)

const timeout = useTimeoutFn(() => {
  visible.value = false
}, LIFETIME, { immediate: false })

watch(visible, (value) => {
  if (value)
    timeout.start()
  else
    timeout.stop()
}, { immediate: true })
</script>

<template>
  <Transition name="fade-in">
    <!-- eslint-disable-next-line vue-a11y/no-static-element-interactions -->
    <div
      v-if="options?.resume?.prompt && visible"
      class="vp-reader-resume"
      role="status"
      aria-live="polite"
      @mouseenter="timeout.stop()"
      @mouseleave="visible && timeout.start()"
      @focusin="timeout.stop()"
      @focusout="visible && timeout.start()"
    >
      <span class="text">{{ text }}</span>
      <span class="actions">
        <button type="button" class="primary" @click="resume">
          {{ theme.readerResumeActionText ?? 'Continue' }}
        </button>
        <button type="button" @click="restart">
          {{ theme.readerResumeRestartText ?? 'Start over' }}
        </button>
      </span>
    </div>
  </Transition>
</template>

<style scoped>
.vp-reader-resume {
  position: fixed;
  bottom: calc(env(safe-area-inset-bottom, 0px) + 24px);
  left: 50%;
  z-index: var(--vp-z-index-overlay);

  display: flex;
  gap: 12px;
  align-items: center;

  max-width: calc(100vw - 48px);
  padding: 8px 8px 8px 16px;

  background-color: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  box-shadow: var(--vp-shadow-3);

  transition: background-color var(--vp-t-color), border-color var(--vp-t-color);
  transform: translateX(-50%);
}

.text {
  font-size: 13px;
  line-height: 20px;
  color: var(--vp-c-text-2);
  white-space: nowrap;
}

.actions {
  display: flex;
  flex-shrink: 0;
  gap: 4px;
}

.actions button {
  padding: 4px 12px;
  font-size: 12px;
  line-height: 20px;
  color: var(--vp-c-text-2);
  white-space: nowrap;
  border-radius: 6px;
  transition: color var(--vp-t-color), background-color var(--vp-t-color);
}

.actions button:hover {
  color: var(--vp-c-text-1);
  background-color: var(--vp-c-default-soft);
}

.actions .primary {
  color: var(--vp-c-brand-1);
}

@media (max-width: 480px) {
  .vp-reader-resume {
    flex-direction: column;
    gap: 4px;
    align-items: stretch;
    padding: 12px 12px 8px;
  }

  .actions {
    justify-content: flex-end;
  }
}

@media (prefers-reduced-motion: reduce) {
  .vp-reader-resume,
  .actions button {
    transition: none;
  }

  .fade-in-enter-active,
  .fade-in-leave-active {
    transition: none !important;
  }
}
</style>
