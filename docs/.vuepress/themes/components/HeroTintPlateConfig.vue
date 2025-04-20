<script setup lang="ts">
import type { PlumeThemeHomeHeroTintPlate } from 'vuepress-theme-plume/client'
import { computed, ref, watch } from 'vue'
import VPHomeHero from 'vuepress-theme-plume/components/Home/VPHomeHero.vue'
import { useDarkMode } from 'vuepress-theme-plume/composables'
import CodeViewer from './CodeViewer.vue'
import CustomTintPlate from './CustomTintPlate.vue'
import DemoWrapper from './DemoWrapper.vue'
import SingleTintPlate from './SingleTintPlate.vue'
import TripletTintPlate from './TripletTintPlate.vue'

type Mode = 'single' | 'triplet' | 'custom'

const hero = { name: 'Theme Plume', tagline: 'Next Theme', text: '简约的，功能丰富', actions: [] }
const modeList: { value: Mode, label: string }[] = [
  { value: 'single', label: '单色' },
  { value: 'triplet', label: '三色' },
  { value: 'custom', label: '三色+偏移' },
]

const mode = ref<Mode>('single')
const singleTintPlate = ref<number>(220)
const tripletTintPlate = ref<[number, number, number]>([220, 220, 220])
const customTintPlate = ref<PlumeThemeHomeHeroTintPlate>({
  r: { value: 220, offset: 36 },
  g: { value: 220, offset: 36 },
  b: { value: 220, offset: 36 },
})

const tintPlate = computed(() => {
  switch (mode.value) {
    case 'single':
      return singleTintPlate.value
    case 'triplet':
      return tripletTintPlate.value.join(',')
    case 'custom':
      return customTintPlate.value
    default:
      return ''
  }
})

const isDark = ref(false)

watch(useDarkMode(), (value) => {
  isDark.value = value
}, { immediate: true })

const output = computed(() => {
  const tint = tintPlate.value
  let content = `---\nhome: true\nconfig:\n  -\n    type: hero\n    background: tint-plate\n    tintPlate:`
  if (typeof tint === 'number' || typeof tint === 'string')
    content += `  ${tint}`

  if (typeof tint === 'object') {
    content += `
      r:
        value: ${tint.r.value}
        offset: ${tint.r.offset}
      g:
        value: ${tint.g.value}
        offset: ${tint.g.offset}
      b:
        value: ${tint.b.value}
        offset: ${tint.b.offset}`
  }

  return `${content}\n---`
})
</script>

<template>
  <div class="hero-tint-plate-wrapper">
    <h4>效果预览：</h4>
    <div :class="{ dark: isDark }">
      <DemoWrapper>
        <VPHomeHero type="hero" background="tint-plate" :tint-plate="tintPlate" :hero="hero" />
      </DemoWrapper>
    </div>
    <p>
      <label for="tint-plate-is-dark">
        <input id="tint-plate-is-dark" v-model="isDark" type="checkbox"> 深色模式
      </label>
    </p>
    <div class="mode-content">
      <button
        v-for="item in modeList"
        :key="item.value"
        class="mode" :class="{ active: mode === item.value }"
        type="button"
        @click="mode = item.value"
      >
        {{ item.label }}
      </button>
    </div>
    <div class="tint-plate-">
      <SingleTintPlate v-if="mode === 'single'" v-model="singleTintPlate" />
      <TripletTintPlate v-if="mode === 'triplet'" v-model="tripletTintPlate" />
      <CustomTintPlate v-if="mode === 'custom'" v-model="customTintPlate" />
    </div>
    <div class="hero-tint-plate-output">
      <h4>输出：</h4>
      <CodeViewer lang="text" :content="output" />
    </div>
  </div>
</template>

<style scoped>
@media (min-width: 960px) {
  .hero-tint-plate-wrapper :deep(.hero-name),
  .hero-tint-plate-wrapper :deep(.hero-tagline) {
    font-size: 48px;
  }
}

.mode-content {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.hero-tint-plate-wrapper :deep(.demo-wrapper) {
  overflow: hidden;
}

.hero-tint-plate-wrapper :deep(.demo-head) {
  background-color: var(--vp-c-bg);
}

.hero-tint-plate-wrapper :deep(.bg-filter::after) {
  background: linear-gradient(to bottom, #fff 0, transparent 40%, transparent 60%, #fff 140%);
}

.hero-tint-plate-wrapper [data-theme="dark"] :deep(.bg-filter::after) {
  background: linear-gradient(to bottom, #1b1b1f 0, transparent 40%, transparent 60%, #1b1b1f 140%);
}

.mode-content .mode {
  flex: 1 2;
  padding: 5px 0;
  color: var(--vp-c-text-1);
  text-align: center;
  cursor: pointer;
  background-color: transparent;
  border-bottom: 1px solid var(--vp-c-divider);
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  transition: var(--vp-t-color);
  transition-property: background-color, border-bottom-color, color;
}

.mode-content .mode.active {
  font-weight: 500;
  color: var(--vp-c-bg);
  background-color: var(--vp-c-brand);
  border-bottom-color: var(--vp-c-brand);
}
</style>
