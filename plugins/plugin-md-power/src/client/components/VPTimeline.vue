<script lang="ts" setup>
import { computed, provide } from 'vue'
import { INJECT_TIMELINE_KEY } from '../options.js'

const props = defineProps<{
  horizontal?: boolean
  card?: boolean
  placement?: 'left' | 'right' | 'between'
  line?: 'solid' | 'dashed' | 'dotted'
}>()

provide(INJECT_TIMELINE_KEY, computed(() => ({
  line: props.line || 'solid',
  card: props.card ?? false,
  horizontal: props.horizontal ?? false,
  placement: props.placement || 'left',
})))
</script>

<template>
  <div class="vp-timeline" :class="{ horizontal }">
    <div class="vp-timeline-box">
      <slot />
    </div>
  </div>
</template>

<style>
.vp-timeline {
  position: relative;
  margin: 32px 0;
}

.vp-timeline.horizontal {
  padding-bottom: 7px;
  overflow-x: auto;
}

.vp-timeline-box {
  display: flex;
  gap: 24px 36px;
}

.vp-timeline:not(.horizontal) .vp-timeline-box {
  flex-direction: column;
}

.vp-timeline.horizontal .vp-timeline-box {
  flex-direction: row;
  width: max-content;
}
</style>
