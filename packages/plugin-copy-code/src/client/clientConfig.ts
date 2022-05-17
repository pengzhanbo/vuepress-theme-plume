import { defineClientConfig } from '@vuepress/client'
import { setupCopyCode } from './composables'

import './styles/button.scss'

export default defineClientConfig({
  setup() {
    setupCopyCode()
  },
})
