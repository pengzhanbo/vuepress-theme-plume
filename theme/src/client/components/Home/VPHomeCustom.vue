<script setup lang="ts">
import { Content } from 'vuepress/client'
import type { PlumeThemeHomeCustom } from '../../../shared/index.js'
import VPHomeBox from './VPHomeBox.vue'

const props = defineProps<PlumeThemeHomeCustom>()
</script>

<template>
  <VPHomeBox class="vp-home-custom" v-bind="props">
    <Content class="vp-doc plume-content" />
  </VPHomeBox>
</template>
