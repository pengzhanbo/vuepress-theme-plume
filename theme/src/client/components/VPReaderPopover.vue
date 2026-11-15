<script setup lang="ts">
import VPReaderSettings from '@theme/VPReaderSettings.vue'
import { onClickOutside, onKeyStroke } from '@vueuse/core'
import { computed, nextTick, ref, useTemplateRef } from 'vue'
import { useData, useReaderPreferences } from '../composables/index.js'

import '@vuepress/helper/transition/fade-in.css'

const { theme } = useData()
const { hasControls: enabled, reset } = useReaderPreferences()

const open = ref(false)
const triggerRef = useTemplateRef<HTMLButtonElement>('trigger')
const panelRef = useTemplateRef<HTMLDivElement>('panel')

const label = computed(() => theme.value.readerPreferencesText ?? 'Reading')
const title = computed(() => theme.value.readerPanelLabel ?? 'Reading settings')

/**
 * 关闭面板，可选择把焦点归还给触发按钮。
 */
function close(restoreFocus = false): void {
  if (!open.value)
    return

  open.value = false

  if (restoreFocus)
    triggerRef.value?.focus()
}

function toggle(): void {
  open.value = !open.value

  if (open.value) {
    nextTick(() => {
      panelRef.value?.querySelector<HTMLElement>('button:not(:disabled)')?.focus()
    })
  }
}

onClickOutside(panelRef, () => close(), { ignore: [triggerRef] })
onKeyStroke('Escape', () => close(true))
</script>

<template>
  <div v-if="enabled" class="vp-navbar-reader">
    <button
      ref="trigger"
      type="button"
      class="trigger"
      :class="{ active: open }"
      :aria-label="label"
      aria-haspopup="dialog"
      :aria-expanded="open"
      @click="toggle"
    >
      <span class="vpi-reader icon" aria-hidden="true" />
    </button>
    <Transition name="fade-in">
      <div
        v-show="open"
        ref="panel"
        class="panel"
        role="dialog"
        aria-modal="false"
        :aria-label="title"
        :inert="!open"
      >
        <div class="reader-header">
          <p class="title">
            {{ title }}
          </p>
          <button type="button" class="reset" @click="reset">
            {{ theme.readerResetText ?? 'Reset' }}
          </button>
        </div>

        <VPReaderSettings />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.vp-navbar-reader {
  position: relative;
  display: none;
}

@media (min-width: 1280px) {
  .vp-navbar-reader {
    display: flex;
    align-items: center;
    height: var(--vp-nav-height);
  }
}

.reader-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px 0;
}

.trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  color: var(--vp-c-text-1);
  border-radius: 8px;
  transition: color var(--vp-t-color), background-color var(--vp-t-color);
}

.trigger:hover,
.trigger.active {
  color: var(--vp-c-brand-1);
  background-color: var(--vp-c-default-soft);
}

.trigger:focus-visible {
  outline-offset: 2px;
}

.icon {
  width: 20px;
  height: 20px;
}

.panel {
  position: absolute;
  top: calc(var(--vp-nav-height) / 2 + 20px);
  right: 0;
  z-index: var(--vp-z-index-overlay);
  width: 288px;
  background-color: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  box-shadow: var(--vp-shadow-3);
  transition: background-color var(--vp-t-color), border-color var(--vp-t-color);
}

.title {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  line-height: 20px;
  color: var(--vp-c-text-1);
}

.reset {
  font-size: 12px;
  line-height: 20px;
  color: var(--vp-c-text-3);
  transition: color var(--vp-t-color);
}
</style>
