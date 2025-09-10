import type { Page } from 'vuepress/core'
import type { ThemePageData } from '../../shared/index.js'
import { toArray } from '@pengzhanbo/utils'
import { genEncrypt } from '../utils/index.js'

export function encryptPage(
  page: Page<ThemePageData>,
): void {
  const password = toArray(page.frontmatter.password)
  if (password.length) {
    page.data._e = password.map(pwd => genEncrypt(pwd as string)).join(':')
  }
  delete page.frontmatter.password
}
