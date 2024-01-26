import { defineClientConfig } from 'vuepress/client'
import type { ClientConfig } from 'vuepress/client'
import { setupCopyCode } from './setupCopyCode.js'

import './styles/button.css'

export default defineClientConfig({
  setup() {
    setupCopyCode()
  },
}) as ClientConfig
