<script setup lang="ts">
import { useId } from 'vue'

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

const id = useId()
</script>

<template>
  <label :for="`range-${id}`" class="input-range">
    <input :id="`range-${id}`" v-model="value" type="range" :min="min" :max="max" :step="step">
  </label>
  <label :for="`range-number-${id}`" class="input-range-number">
    <input :id="`range-number-${id}`" v-model="value" type="number" :min="min" :max="max" :step="step">
  </label>
</template>

<style scoped>
.input-range {
  flex: 1 2;
}

.input-range input {
  width: 100%;
}

.input-range-number {
  width: 50px;
  margin-left: 10px;
  text-align: center;
  border: 1px solid var(--vp-c-divider);
}
</style>
