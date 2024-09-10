import { withBase } from 'vuepress/client'
import { isLinkHttp } from 'vuepress/shared'

export function normalizeLink(url: string): string {
  return isLinkHttp(url) ? url : withBase(url)
}
