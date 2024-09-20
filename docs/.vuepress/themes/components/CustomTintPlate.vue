<script setup lang="ts">
import type { PlumeThemeHomeHeroTintPlate } from 'vuepress-theme-plume/client'
import { computed, watch } from 'vue'
import InputRange from './InputRange.vue'

const min = 20
const max = 240

const tintPlate = defineModel<PlumeThemeHomeHeroTintPlate>({
  required: true,
})

const offsetRMax = computed(() => 256 - tintPlate.value.r.value)
const offsetGMax = computed(() => 256 - tintPlate.value.g.value)
const offsetBMax = computed(() => 256 - tintPlate.value.b.value)

function addWatch(key: 'r' | 'g' | 'b') {
  return watch(() => tintPlate.value[key].value, (value) => {
    const max = 256 - value
    const offset = tintPlate.value[key].offset
    if (offset > max)
      tintPlate.value[key].offset = max
  })
}

addWatch('r')
addWatch('g')
addWatch('b')
</script>

<template>
  <p>浅色模式建议使用 "150 ~ 240" 之间的值， 深色模式建议使用 "20 ~ 80" 之间的值：</p>
  <div class="custom-tint-plate">
    <span>R:</span>
    <InputRange v-model="tintPlate.r.value" :min="min" :max="max" />
    <span class="offset">offset</span>
    <InputRange v-model="tintPlate.r.offset" :max="offsetRMax" />
  </div>
  <div class="custom-tint-plate">
    <span>G:</span>
    <InputRange v-model="tintPlate.g.value" :min="min" :max="max" />
    <span class="offset">offset</span>
    <InputRange v-model="tintPlate.g.offset" :max="offsetGMax" />
  </div>
  <div class="custom-tint-plate">
    <span>B:</span>
    <InputRange v-model="tintPlate.b.value" :min="min" :max="max" />
    <span class="offset">offset</span>
    <InputRange v-model="tintPlate.b.offset" :max="offsetBMax" />
  </div>
</template>

<style scoped>
.custom-tint-plate {
  display: flex;
  align-items: center;
  padding: 16px 0 0;
}

.custom-tint-plate .offset {
  margin: 0 5px;
  font-size: 0.9em;
  color: var(--vp-c-text-2);
}
</style>
