<script setup lang="ts">
import InputRange from './InputRange.vue'

const tintPlate = defineModel<number>({
  required: true,
})
</script>

<template>
  <p>浅色模式建议使用 "150 ~ 240" 之间的值， 深色模式建议使用 "20 ~ 80" 之间的值：</p>
  <div class="single-tint-plate">
    <span>RGB:</span>
    <InputRange v-model="tintPlate" :max="240" :min="20" />
  </div>
</template>

<style scoped>
.single-tint-plate {
  display: flex;
  align-items: center;
  padding: 16px 0 0;
}
</style>
