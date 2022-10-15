import { defineClientConfig } from '@vuepress/client'
import { setupCopyCode } from './composables/index.js'

import './styles/button.scss'

export default defineClientConfig({
  setup() {
    setupCopyCode()
  },
})
