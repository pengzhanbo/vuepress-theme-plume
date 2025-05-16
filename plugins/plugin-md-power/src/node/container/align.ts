import type { Markdown } from 'vuepress/markdown'
import { parseRect } from '../utils/parseRect.js'
import { resolveAttrs } from '../utils/resolveAttrs.js'
import { createContainerPlugin } from './createContainer.js'

const alignList = ['left', 'center', 'right', 'justify']

export function alignPlugin(md: Markdown): void {
  for (const name of alignList) {
    createContainerPlugin(md, name, {
      before: () => `<div style="text-align:${name}">`,
    })
  }

  createContainerPlugin(md, 'flex', {
    before: (info) => {
      const { attrs } = resolveAttrs<FlexContainerAttrs>(info)
      const styles: string[] = ['margin:16px 0;display:flex']

      const align = attrs.start ? 'flex-start' : attrs.end ? 'flex-end' : attrs.center ? 'center' : ''
      const justify = attrs.between ? 'space-between' : attrs.around ? 'space-around' : attrs.center ? 'center' : ''

      if (align)
        styles.push(`align-items:${align}`)

      if (justify)
        styles.push(`justify-content:${justify}`)

      if (attrs.column)
        styles.push('flex-direction:column')

      if (attrs.wrap)
        styles.push('flex-wrap:wrap')

      styles.push(`gap:${parseRect(attrs.gap || '16')}`)

      return `<div style="${styles.join(';')}">`
    },
  })
}

interface FlexContainerAttrs {
  center?: boolean
  wrap?: boolean
  between?: boolean
  around?: boolean
  start?: boolean
  end?: boolean
  gap?: string
  column?: boolean
}
