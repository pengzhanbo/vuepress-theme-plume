import { defineClientConfig } from '@vuepress/client'
import { setupCopyCode } from './setupCopyCode.js'

import './styles/button.scss'

export default defineClientConfig({
  setup() {
    setupCopyCode()
  },
})
