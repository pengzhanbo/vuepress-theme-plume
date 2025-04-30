<script setup lang="ts">
import { computed } from 'vue'
import { useData, useEncrypt } from '../composables/index.js'

const { frontmatter, isDark } = useData()
const { isPageDecrypted } = useEncrypt()

const hasComment = computed(() =>
  frontmatter.value.comments !== false && isPageDecrypted.value,
)
</script>

<template>
  <DocComment v-if="hasComment" :darkmode="isDark" vp-comment />
</template>
