<script setup lang="ts">
import { provide, ref } from 'vue'
import { INJECT_COLLAPSE_KEY } from '../options.js'

const props = defineProps<{
  accordion?: boolean
  index?: number
}>()

const currentIndex = ref<number | undefined>(props.index)

provide(INJECT_COLLAPSE_KEY, {
  accordion: props.accordion ?? false,
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
</style>
