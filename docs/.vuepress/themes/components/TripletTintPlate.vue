<script setup lang="ts">
import InputRange from './InputRange.vue'

const min = 20
const max = 240

const tintPlate = defineModel<[number, number, number]>({
  required: true,
})
</script>

<template>
  <p>浅色模式建议使用 "150 ~ 240" 之间的值， 深色模式建议使用 "20 ~ 80" 之间的值：</p>
  <div class="triplet-tint-plate">
    <span>R:</span>
    <InputRange v-model="tintPlate[0]" :min="min" :max="max" />
  </div>
  <div class="triplet-tint-plate">
    <span>G:</span>
    <InputRange v-model="tintPlate[1]" :min="min" :max="max" />
  </div>
  <div class="triplet-tint-plate">
    <span>B:</span>
    <InputRange v-model="tintPlate[2]" :min="min" :max="max" />
  </div>
</template>

<style scoped>
.triplet-tint-plate {
  display: flex;
  align-items: center;
  padding: 16px 0 0;
}
</style>
