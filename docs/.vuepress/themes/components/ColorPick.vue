<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import '@simonwep/pickr/dist/themes/nano.min.css'

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

const color = defineModel<string>('modelValue', { default: 'rgba(0,0,0,1)' })
const pickerEl = ref<HTMLDivElement>()
let picker: any

onMounted(async () => {
  if (!pickerEl.value || picker)
    return

  const { default: Pickr } = await import('@simonwep/pickr')

  picker = Pickr.create({
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
  width: 40px;
  height: 40px;
  background-color: var(--vp-c-bg-soft);
  border: solid 1px var(--vp-c-divider);
  border-radius: 32px;
  transition: border-color var(--vp-t-color), background-color var(--vp-t-color);
}

.pickr .pcr-button {
  overflow: hidden;
  border-radius: 50% !important;
}
</style>
