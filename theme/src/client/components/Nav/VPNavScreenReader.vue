<script setup lang="ts">
import VPReaderSettings from '@theme/VPReaderSettings.vue'
import { FadeInExpandTransition } from '@vuepress/helper/client'
import { computed, ref } from 'vue'
import { useData, useReaderPreferences } from '../../composables/index.js'

import '@vuepress/helper/transition/fade-in-height-expand.css'

const { theme } = useData()
const { hasControls } = useReaderPreferences()

const open = ref(false)

const label = computed(() => theme.value.readerPreferencesText ?? 'Reading')
</script>

<template>
  <div v-if="hasControls" class="vp-nav-screen-reader">
    <button
      type="button"
      class="toggle"
      :aria-expanded="open"
      @click="open = !open"
    >
      <span class="text">{{ label }}</span>
      <span class="vpi-chevron-right icon" :class="{ open }" aria-hidden="true" />
    </button>

    <FadeInExpandTransition>
      <div v-show="open" class="content">
        <VPReaderSettings compact />
      </div>
    </FadeInExpandTransition>
  </div>
</template>

<style scoped>
.vp-nav-screen-reader {
  background-color: var(--vp-c-bg-soft);
  border-radius: 8px;
  transition: background-color var(--vp-t-color);
}

.toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 14px 12px 16px;
}

.text {
  font-size: 12px;
  font-weight: 500;
  line-height: 24px;
  color: var(--vp-c-text-2);
}

.icon {
  width: 16px;
  height: 16px;
  color: var(--vp-c-text-3);
  transition: transform var(--vp-t-color);
}

.icon.open {
  transform: rotate(90deg);
}

.content {
  padding: 0 16px;
}

.content :deep(.vp-reader-settings.compact) {
  padding-bottom: 16px;
}
</style>
