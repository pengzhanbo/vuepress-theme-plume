import type { Markdown } from 'vuepress/markdown'
import { isUndefined } from '@pengzhanbo/utils'
import { resolveAttrs } from '../utils/resolveAttrs.js'
import { stringifyAttrs } from '../utils/stringifyAttrs.js'
import { createContainerPlugin } from './createContainer.js'

/**
 * Field attributes
 *
 * 字段属性
 */
interface FieldAttrs {
  name: string
  type?: string
  required?: boolean
  optional?: boolean
  deprecated?: boolean
  default?: string
}

/**
 * Field plugin - Enable field container for API documentation
 *
 * 字段插件 - 启用用于 API 文档的字段容器
 *
 * Syntax: ::: field name="xxx" type="string" required
 * 语法：::: field name="xxx" type="string" required
 *
 * @param md - Markdown instance / Markdown 实例
 */
export function fieldPlugin(md: Markdown): void {
  createContainerPlugin(md, 'field', {
    before: (info) => {
      const { attrs } = resolveAttrs<FieldAttrs>(info)
      const { name, type, required, optional, deprecated, default: defaultValue } = attrs
      const props = stringifyAttrs({ name, required, optional, deprecated })
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
