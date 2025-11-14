<script setup lang="ts">
import { provide, ref } from 'vue'
import { INJECT_COLLAPSE_KEY } from '../options.js'

const { accordion, index } = defineProps<{
  accordion?: boolean
  index?: number
}>()

const currentIndex = ref<number | undefined>(index)

provide(INJECT_COLLAPSE_KEY, {
  accordion: accordion ?? false,
  index: currentIndex,
})
</script>

<template>
  <div class="vp-collapse">
    <slot />
  </div>
</template>

<style>
.vp-collapse {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 16px 0;
}

.vp-card-wrapper .body > :first-child:where(.vp-collapse) > .vp-collapse-item:first-child {
  padding-top: 0;
}
</style>
