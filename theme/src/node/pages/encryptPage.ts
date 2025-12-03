import type { Page } from 'vuepress/core'
import type { ThemePageData } from '../../shared/index.js'
import { toArray } from '@pengzhanbo/utils'
import pMap from 'p-map'
import { genEncrypt } from '../utils/index.js'

export async function encryptPage(
  page: Page<ThemePageData>,
): Promise<void> {
  const password = toArray(page.frontmatter.password) as string[]
  if (password.length) {
    page.data._e = (await pMap(password, item => genEncrypt(item))).join(':')
  }
  delete page.frontmatter.password
}
