<script setup lang="ts">
interface Props {
  min?: number
  max: number
  step?: number
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  step: 1,
})
const value = defineModel<number>({
  required: true,
  set(v) {
    return Math.min(Math.max(v, props.min), props.max)
  },
})
</script>

<template>
  <input v-model="value" type="range" :min="min" :max="max" :step="step">
  <input v-model="value" type="number" :min="min" :max="max" :step="step">
</template>

<style scoped>
input[type="range"] {
  flex: 1;
}

input[type="number"] {
  width: 50px;
  margin-left: 10px;
  text-align: center;
  border: 1px solid var(--vp-c-divider);
}
</style>
