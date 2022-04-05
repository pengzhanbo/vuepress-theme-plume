import { defineClientAppSetup } from '@vuepress/client'
import { setupDarkMode } from './composables'

export default defineClientAppSetup(() => {
  setupDarkMode()
})
