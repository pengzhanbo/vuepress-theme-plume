<script setup lang="ts">
import { Content } from 'vuepress/client'
import VPHomeBox from '@theme/Home/VPHomeBox.vue'
import type { PlumeThemeHomeCustom } from '../../../shared/index.js'

const props = defineProps<PlumeThemeHomeCustom>()
</script>

<template>
  <VPHomeBox class="vp-home-custom" v-bind="props">
    <Content class="vp-doc" />
  </VPHomeBox>
</template>
