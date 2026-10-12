<script setup lang="ts">
import { decodeData } from '@vuepress/helper/client'
import { useClipboard } from '@vueuse/core'
import { computed, useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })

const { text, encode = false } = defineProps<{
  text: string
  encode?: boolean
}>()

const attrs = useAttrs()

const content = computed(() => encode ? decodeData(text) : text)

const copyLabel = computed(() => (attrs['aria-label'] as string | undefined) || 'Copy')
const copiedLabel = computed(() => (attrs['data-copied'] as string | undefined) || 'Copied')

const { copied, copy } = useClipboard()
</script>

<template>
  <button
    type="button" class="vp-copy-code-button" :class="{ copied }"
    :aria-label="copied ? copiedLabel : copyLabel"
    :data-copied="copiedLabel"
    @click="copy(content)"
  >
    <span class="visually-hidden" role="status" aria-live="polite">{{ copied ? copiedLabel : '' }}</span>
  </button>
</template>

<style>
.vp-copy-code-button:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
  opacity: 1;
}
</style>
