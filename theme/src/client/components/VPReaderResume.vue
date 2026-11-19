<script setup lang="ts">
import { useTimeoutFn } from '@vueuse/core'
import { computed, ref, watch } from 'vue'
import { useData, useReaderPreferences, useResumeReading } from '../composables/index.js'

import '@vuepress/helper/transition/fade-in.css'

/**
 * 自动消失的延迟。鼠标或焦点停留在提示条上时暂停计时。
 */
const LIFETIME = 8000

const { theme } = useData()
const { options } = useReaderPreferences()
const { saved, visible, resume, restart } = useResumeReading()

const percent = computed(() => Math.round((saved.value ?? 0) * 100))
const text = computed(() =>
  (theme.value.readerResumeText ?? 'Last read {percent}%').replace('{percent}', String(percent.value)))

const timeout = useTimeoutFn(() => {
  visible.value = false
}, LIFETIME, { immediate: false })

const root = ref<HTMLElement | null>(null)

// 鼠标停留与焦点停留在提示内部时都要暂停计时，两者是独立的状态。
const hovered = ref(false)
const focused = ref(false)

/**
 * 只有鼠标已经离开且焦点也不在提示内部时才恢复计时。
 */
function arm(): void {
  if (!visible.value || hovered.value || focused.value)
    return

  timeout.start()
}

function onMouseEnter(): void {
  hovered.value = true
  timeout.stop()
}

function onMouseLeave(): void {
  hovered.value = false
  arm()
}

function onFocusIn(): void {
  focused.value = true
  timeout.stop()
}

function onFocusOut(event: FocusEvent): void {
  const next = event.relatedTarget as Node | null
  if (next && root.value?.contains(next))
    return

  focused.value = false
  arm()
}

watch(visible, (value) => {
  if (value) {
    hovered.value = false
    focused.value = false
    timeout.start()
  }
  else {
    timeout.stop()
  }
}, { immediate: true })
</script>

<template>
  <Transition name="fade-in">
    <!-- eslint-disable-next-line vue-a11y/no-static-element-interactions -->
    <div
      v-if="options?.resume?.prompt && visible"
      ref="root"
      class="vp-reader-resume"
      role="status"
      aria-live="polite"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
      @focusin="onFocusIn"
      @focusout="onFocusOut"
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
