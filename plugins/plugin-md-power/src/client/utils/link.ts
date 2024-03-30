import { isLinkHttp } from 'vuepress/shared'
import { withBase } from 'vuepress/client'

export function normalizeLink(url: string): string {
  return isLinkHttp(url) ? url : withBase(url)
}
