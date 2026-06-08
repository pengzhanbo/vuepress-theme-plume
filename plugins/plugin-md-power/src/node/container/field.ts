import type { Markdown, MarkdownEnv } from 'vuepress/markdown'
import { isUndefined, objectKeys } from '@pengzhanbo/utils'
import { colors } from 'vuepress/utils'
import { cleanMarkdownEnv } from '../utils/cleanMarkdownEnv.js'
import { logger } from '../utils/logger.js'
import { stringifyAttrs } from '../utils/stringifyAttrs.js'
import { createContainerPlugin, createContainerSyntaxPlugin } from './createContainer.js'

/**
 * Parsed result from a `::: field` container block.
 *
 * 字段对象 — 解析自 `::: field` 容器块的结构化结果
 */
export interface FieldObject {
  /**
   * Field name — defaults to `info`, overridable via `@name`
   *
   * 字段名称 — 默认从 `info` 中获取，可通过 `@name` 覆盖
   */
  name: string
  /**
   * `@type` value, undefined if not set
   *
   * 类型注解 — 如果未设置则为 `undefined`
   */
  type?: string
  /**
   * `@default` value, preserved as-is
   *
   * 默认值 — 保持原样
   */
  default?: string
  /**
   * Whether `@required` is present
   *
   * 是否为必填项 — 是否在 `@required` 标签中
   */
  required?: boolean
  /**
   * Whether `@deprecated` is present
   *
   * 是否为已弃用项 — 是否在 `@deprecated` 标签中
   */
  deprecated?: boolean
  /**
   * Whether `@optional` is present
   *
   * 是否为可选项 — 是否在 `@optional` 标签中
   */
  optional?: boolean
  /**
   * Description text, may span multiple lines joined by `\n`
   *
   * 描述文本 — 可跨多行，以 `\n` 连接
   */
  description?: string
}

/** Tags that carry structured meaning; everything else is description text. */
const KNOWN_TAGS = new Set([
  'name',
  'type',
  'default',
  'required',
  'deprecated',
  'optional',
  'description',
])

const BACKTICK_RE = /^`|`$/g

/**
 * Parse the body of a `::: field` container into a structured `FieldObject`.
 *
 * Supports a JSDoc-style tag syntax:
 * - `@name` — override the field name (derived from `info` by default)
 * - `@type` — type annotation
 * - `@default` — default value
 * - `@required` — mark as required (boolean flag)
 * - `@deprecated` — mark as deprecated (boolean flag)
 * - `@optional` — mark as optional (boolean flag)
 * - `@description` — explicit description; any non-tag line also feeds into description
 *
 * Unknown `@`-prefixed tags are treated as description text.
 * Empty lines are ignored and never interrupt a description paragraph.
 *
 * 将 `::: field` 容器的正文解析为结构化的 `FieldObject`。
 *
 * 支持类 JSDoc 的标签语法：
 * - `@name` — 覆盖字段名称（默认从 `info` 派生）
 * - `@type` — 类型注解
 * - `@default` — 默认值
 * - `@required` — 标记为必需（布尔标志）
 * - `@deprecated` — 标记为已弃用（布尔标志）
 * - `@optional` — 标记为可选（布尔标志）
 * - `@description` — 显式描述；任何非标签行也会被纳入描述
 *
 * 未知的以 `@` 开头的标签将被视为描述文本。
 * 空行会被忽略，且不会中断描述段落。
 *
 * @param content Raw text inside the `:::` container
 * @param info    Text after `::: field` on the opening line (the field name)
 */
export function parseFieldContent(content: string, info: string): FieldObject {
  const lines = content.split('\n')

  const result: FieldObject = {
    name: info.trim(),
    description: '',
  }

  /** Accumulates the current description paragraph. */
  let currentDesc = ''
  /** Completed description segments, joined with `\n` at the end. */
  const descriptions: string[] = []

  function flushDesc(): void {
    if (currentDesc) {
      descriptions.push(currentDesc)
      currentDesc = ''
    }
  }

  for (const rawLine of lines) {
    const line = rawLine.trim()

    if (line.startsWith('@')) {
      // Extract the first word as the tag name, the remainder as the value.
      const spaceIdx = line.indexOf(' ')
      let tag: string
      let rest: string

      if (spaceIdx === -1) {
        tag = line.slice(1) // strip leading '@'
        rest = ''
      }
      else {
        tag = line.slice(1, spaceIdx).toLowerCase()
        // Remove exactly one leading space after the tag name.
        rest = line.slice(spaceIdx + 1).trim()
      }

      if (KNOWN_TAGS.has(tag)) {
        // A known tag ends the current description paragraph.
        flushDesc()

        switch (tag) {
          case 'name':
          case 'type':
          case 'default':
            rest && (result[tag] = rest.replace(BACKTICK_RE, '')) // remove backticks
            break
          case 'required':
          case 'deprecated':
          case 'optional':
            result[tag] = true
            break
          case 'description':
            currentDesc = rest
            break
        }
      }
      else {
        // Unknown @-tag — the entire line (including '@') is description text.
        if (currentDesc)
          currentDesc += '\n'
        currentDesc += line
      }
    }
    else {
      // Plain text line — append to the current description paragraph.
      if (currentDesc)
        currentDesc += '\n'
      currentDesc += line
    }
  }

  // Flush any remaining description after the last line.
  flushDesc()

  result.description = descriptions.join('\n')

  return result
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
  createContainerPlugin(md, 'field-group', {
    before: () => '<div class="vp-field-group">',
  })

  createContainerSyntaxPlugin(md, 'field', (tokens, idx, _, env: MarkdownEnv) => {
    const { info, content, meta } = tokens[idx]
    if (meta.name && objectKeys(meta).length > 1) {
      logger.warn(`[Field container \`::: field\` name="${meta.name}"]`, `\n  No longer support attribute-style syntax. Please use \`@tag\` syntax instead.\n  see ${colors.cyan('https://theme-plume.vuejs.press/guide/markdown/field/')}\n  at ${colors.gray(env.filePathRelative!)}`)
    }

    const { name, type, required, optional, deprecated, default: defaultValue, description } = { ...meta, ...parseFieldContent(content, info.includes('=') ? '' : info) }

    const props = stringifyAttrs({ name: name || meta.name, required, optional, deprecated })
    return `<VPField${props}${
      !isUndefined(type) ? ` type="${encodeURIComponent(type)}"` : ''
    }${
      !isUndefined(defaultValue) ? ` default-value="${encodeURIComponent(defaultValue)}"` : ''
    }>${description ? md.render(description, cleanMarkdownEnv(env)) : ''}</VPField>`
  })
}
