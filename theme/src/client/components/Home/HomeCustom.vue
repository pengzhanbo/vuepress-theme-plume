<script setup lang="ts">
import { Content } from 'vuepress/client'
import type { PlumeThemeHomeCustom } from '../../../shared/index.js'
import HomeBox from './HomeBox.vue'

const props = defineProps<PlumeThemeHomeCustom>()
</script>

<template>
  <HomeBox class="home-custom" v-bind="props">
    <Content class="plume-content" />
  </HomeBox>
</template>
