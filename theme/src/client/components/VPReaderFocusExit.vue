<script setup lang="ts">
import { onKeyStroke } from '@vueuse/core'
import { computed } from 'vue'
import { useData, useReaderPreferences } from '../composables/index.js'
import { resolveEffectiveFocus } from '../utils/index.js'

import '@vuepress/helper/transition/fade-in.css'

const { theme } = useData()
const { options, prefs, mobile, setPreference } = useReaderPreferences()

/**
 * 只有功能启用且专注模式真正生效时才显示退出控件。
 *
 * 小屏上专注模式不会生效（隐藏导航栏会失去打开抽屉的唯一入口），
 * 但存储的偏好需要保留：视口变宽后仍会重新生效，因此只在这里按当前视口判定。
 */
const active = computed(() =>
  options.value?.focusMode === true && resolveEffectiveFocus(prefs.value.focus, mobile.value),
)

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
