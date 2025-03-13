import { defineClientConfig } from 'vuepress/client'
import Contributors from './themes/components/Contributors.vue'
import Demos from './themes/components/Demos.vue'
import { setupThemeColors } from './themes/composables/theme-colors.js'

export default defineClientConfig({
  enhance({ app }) {
    app.component('Demos', Demos)
    app.component('Contributors', Contributors)
  },
  setup() {
    setupThemeColors()
  },
})
