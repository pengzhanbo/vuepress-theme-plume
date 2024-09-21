<script setup lang="ts">
import type { PlumeThemeHomeCustom } from '../../../shared/index.js'
import VPHomeBox from '@theme/Home/VPHomeBox.vue'
import { Content } from 'vuepress/client'

const props = defineProps<PlumeThemeHomeCustom>()
</script>

<template>
  <VPHomeBox class="vp-home-custom" v-bind="props">
    <Content class="vp-doc" vp-content />
  </VPHomeBox>
</template>
