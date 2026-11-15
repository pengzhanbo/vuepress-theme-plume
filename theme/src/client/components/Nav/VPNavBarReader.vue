<script setup lang="ts">
import VPReaderPopover from '@theme/VPReaderPopover.vue'
import { useReaderPreferences } from '../../composables/index.js'

const { hasControls: enabled } = useReaderPreferences()
</script>

<template>
  <VPReaderPopover v-if="enabled" />
</template>
