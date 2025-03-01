import { defineClientConfig } from 'vuepress/client'
import CanIUseConfig from './themes/components/CanIUseConfig.vue'
import Contributors from './themes/components/Contributors.vue'
import Countdown from './themes/components/Countdown.vue'
import Demos from './themes/components/Demos.vue'
import HeroTintPlateConfig from './themes/components/HeroTintPlateConfig.vue'
import ThemeColors from './themes/components/ThemeColors.vue'
import { setupThemeColors } from './themes/composables/theme-colors.js'

export default defineClientConfig({
  enhance({ app }) {
    app.component('HeroTintPlateConfig', HeroTintPlateConfig)
    app.component('CanIUseConfig', CanIUseConfig)
    app.component('Demos', Demos)
    app.component('ThemeColors', ThemeColors)
    app.component('Contributors', Contributors)
    app.component('Countdown', Countdown)
  },
  setup() {
    setupThemeColors()
  },
})
