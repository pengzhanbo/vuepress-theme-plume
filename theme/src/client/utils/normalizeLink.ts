import { withBase } from '@vuepress/client'
import { isExternal, PATHNAME_PROTOCOL_RE } from './shared.js'

export function normalizeLink(url: string): string {
  if (isExternal(url)) {
    return url.replace(PATHNAME_PROTOCOL_RE, '')
  }

  const { pathname, search, hash } = new URL(url, 'http://example.com')

  const normalizedPath =
    pathname.endsWith('/') || pathname.endsWith('.html')
      ? url
      : url.replace(
          /(?:(^\.+)\/)?.*$/,
          `$1${pathname.replace(/(\.md)?$/, '.html')}${search}${hash}`
        )

  return withBase(normalizedPath)
}
