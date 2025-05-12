import type { Markdown } from 'vuepress/markdown'
import { isUndefined } from '@pengzhanbo/utils'
import { resolveAttrs } from '../utils/resolveAttrs.js'
import { stringifyAttrs } from '../utils/stringifyAttrs.js'
import { createContainerPlugin } from './createContainer.js'

interface FieldAttrs {
  name: string
  type?: string
  required?: boolean
  optional?: boolean
  default?: string
}

export function fieldPlugin(md: Markdown): void {
  createContainerPlugin(md, 'field', {
    before: (info) => {
      const { attrs } = resolveAttrs<FieldAttrs>(info)
      const { name, type, required, optional, default: defaultValue } = attrs
      const props = stringifyAttrs({ name, required, optional })
      return `<VPField${props}${
        !isUndefined(type) ? ` type="${type}"` : ''
      }${
        !isUndefined(defaultValue) ? ` default-value="${defaultValue}"` : ''
      }>`
    },
    after: () => '</VPField>',
  })

  createContainerPlugin(md, 'field-group', {
    before: () => '<div class="vp-field-group">',
  })
}
