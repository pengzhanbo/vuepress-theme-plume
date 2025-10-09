<script setup lang="ts">
import { computed } from 'vue'
import VPButton from 'vuepress-theme-plume/components/VPButton.vue'
import { useRouteLocale } from 'vuepress/client'
import { useThemeColors } from '../composables/theme-colors.js'
import CodeViewer from './CodeViewer.vue'
import ColorPick from './ColorPick.vue'

const locales: LocaleConfig<
  Record<'reset' | 'light' | 'dark' | 'desc' | 'tip', string>
> = {
  '/': {
    reset: '重置',
    light: '浅色主题',
    dark: '深色主题',
    desc: '复制下方的代码到您的项目中，请参考',
    tip: '主题定制',
  },
  '/en/': {
    reset: 'Reset',
    light: 'Light theme',
    dark: 'Dark theme',
    desc: 'Copy the code below and paste it into your project, please refer to',
    tip: 'Theme customization',
  },
}

const routeLocale = useRouteLocale()
const locale = computed(() => locales[routeLocale.value])

const { lightColors, darkColors, css, reset } = useThemeColors()
</script>

<template>
  <VPButton theme="alt" :text="locale.reset" @click="reset" />

  <h2>{{ locale.light }}</h2>
  <div class="theme-colors-wrapper">
    <div v-for="({ name, group }, index) in lightColors" :key="index" class="group">
      <h4>{{ name }}</h4>
      <section v-for="color in group" :key="color.key" class="theme-color">
        <ColorPick v-model="color.value" />
        <div>
          <h5>{{ color.name }}</h5>
          <span class="desc">{{ color.desc }}</span>
        </div>
      </section>
    </div>
  </div>
  <h2>{{ locale.dark }}</h2>
  <div class="theme-colors-wrapper">
    <div v-for="({ name, group }, index) in darkColors" :key="index" class="group">
      <h4>{{ name }}</h4>
      <section v-for="color in group" :key="color.key" class="theme-color">
        <ColorPick v-model="color.value" />
        <div>
          <h5>{{ color.name }}</h5>
          <span class="desc">{{ color.desc }}</span>
        </div>
      </section>
    </div>
  </div>
  <p>{{ locale.desc }} <a href="/guide/custom-style/">{{ locale.tip }}</a> </p>
  <CodeViewer :content="css" lang="css" />
</template>

<style scoped>
.theme-colors-wrapper {
  display: grid;
  gap: 8px 16px;
}

@media (min-width: 640px) {
  .theme-colors-wrapper {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 1440px) {
  .theme-colors-wrapper {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

.theme-color {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 8px;
}

.theme-color h5 {
  margin: 0;
}

.theme-color .desc {
  font-size: 14px;
  color: var(--vp-c-text-2);
  transition: color var(--vp-t-color);
}
</style>
