<script setup lang="ts">
import type { NpmBadgeOptions } from '../composables/npm-badge.js'
import { toRef } from 'vue'
import { useNpmBadge } from '../composables/npm-badge.js'

const props = defineProps<NpmBadgeOptions>()

const info = useNpmBadge(toRef(() => props))
</script>

<template>
  <span class="vp-npm-badge">
    <img v-if="!info.link" :src="info.badgeUrl" :alt="info.alt">
    <a v-else :href="info.link" target="_blank" rel="noreferrer" class="no-icon">
      <img :src="info.badgeUrl" :alt="info.alt">
    </a>
  </span>
</template>

<style>
.vp-npm-badge {
  display: inline-flex;
  vertical-align: middle;
}

:where(div,p,h2,h3,h4,h5,h6,li):not(.vp-npm-badge-group) > .vp-npm-badge + .vp-npm-badge {
  margin-inline-start: 8px;
}

.vp-npm-badge a {
  display: inline-flex;
  text-decoration: none;
  text-underline-offset: 0;
}
</style>
