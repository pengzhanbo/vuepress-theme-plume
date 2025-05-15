import type { IconOptions } from '../../shared/index.js'
import { kebabCase, omit } from '@pengzhanbo/utils'
import { resolveAttrs } from '../utils/resolveAttrs.js'

export interface ResolvedIcon {
  provider: Exclude<IconOptions['provider'], undefined>
  size?: string | number
  color?: string
  name: string
  extra?: string
}

const RE_SIZE = /(?<=\s|^)=(.+?)(?:\s|$)/
const RE_COLOR = /(?<=\s|^)\/(.+?)(?:\s|$)/
const RE_PROVIDER = /^(iconify|iconfont|fontawesome)\s+/
const RE_EXTRA_KEY = /(?:^|-)\d-/g

export function resolveIcon(content: string, options: IconOptions): ResolvedIcon {
  let size = options.size
  let color = options.color
  let provider = options.provider || 'iconify'

  content = content
    .replace(RE_PROVIDER, (_, p) => {
      provider = p
      return ''
    })
    .replace(RE_SIZE, (_, s) => {
      size = s
      return ''
    })
    .replace(RE_COLOR, (_, c) => {
      color = c
      return ''
    })
    .trim()

  const index = content.indexOf(' ')
  const name = index === -1 ? content : content.slice(0, index)
  const extra = index === -1 ? '' : content.slice(index + 1)
  const props = { provider, size, color, name }
  if (!extra) {
    return props
  }

  const { attrs } = resolveAttrs(extra)
  const info: string[] = []
  const excludes: string[] = []

  for (const key in attrs) {
    if (attrs[key] === true) {
      excludes.push(key)
      info.push(kebabCase(key).replace(RE_EXTRA_KEY, m => `${m.slice(0, -1)}`))
    }
  }
  return { ...props, extra: info.join(' '), ...omit(attrs, excludes) }
}
