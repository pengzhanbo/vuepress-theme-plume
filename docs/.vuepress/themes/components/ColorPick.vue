<script setup lang="ts">
import 'https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/pickr.es5.min.js'
import { onMounted, onUnmounted, ref, watch } from 'vue'

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

// eslint-disable-next-line ts/no-namespace
declare namespace window {
  const Pickr: any
}

const color = defineModel<string>('modelValue', { default: 'rgba(0,0,0,1)' })
const pickerEl = ref<HTMLDivElement>()
let picker: any

onMounted(() => {
  if (!pickerEl.value || picker)
    return

  picker = window.Pickr.create({
    el: pickerEl.value,
    theme: 'nano',
    default: color.value,
    defaultRepresentation: 'RGBA',
    showAlways: false,
    components: {
      preview: true,
      opacity: true,
      hue: true,
      interaction: { input: true },
    },
  })
  picker.on('change', (hsva) => {
    emit('update:modelValue', hsva.toRGBA().toString(0))
  })
  watch(color, () => {
    picker?.setColor(color.value)
  })
})

onUnmounted(() => {
  picker?.destroyAndRemove()
  picker = null
})
</script>

<template>
  <div class="color-picker">
    <div ref="pickerEl" />
  </div>
</template>

<style>
.color-picker {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  background-color: var(--vp-c-bg-soft);
  border: solid 1px var(--vp-c-divider);
  border-radius: 32px;
  transition: border-color var(--t-color), background-color var(--t-color);
}

.pickr .pcr-button {
  overflow: hidden;
  border-radius: 50% !important;
}
</style>
