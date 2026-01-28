<script setup lang="ts">
import { decodeData } from '@vuepress/helper/client'
import { useClipboard } from '@vueuse/core'
import { computed } from 'vue'

const { text, encode = false } = defineProps<{
  text: string
  encode?: boolean
}>()

const content = computed(() => encode ? decodeData(text) : text)

const { copied, copy } = useClipboard()
</script>

<template>
  <button
    type="button" class="vp-copy-code-button" :class="{ copied }"
    aria-label="Copy"
    data-copied="Copied"
    @click="copy(content)"
  />
</template>
