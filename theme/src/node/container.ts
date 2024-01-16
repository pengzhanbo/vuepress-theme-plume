import containerPlugin from '@vuepress/plugin-container'
import type { Plugin } from '@vuepress/core'

export const customContainers: Plugin[] = [
  containerPlugin({
    type: 'demo-wrapper',
    before() {
      return `<div class="demo-wrapper"><div class="demo-head"><i></i><i></i><i></i></div><div class="demo-container">\n`
    },
    after() {
      return '</div></div>\n'
    },
  }),
]
