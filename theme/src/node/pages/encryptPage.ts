import type { Page } from 'vuepress/core'
import type { ThemePageData } from '../../shared/index.js'
import { deleteKey, toArray } from '@pengzhanbo/utils'
import pMap from 'p-map'
import { genEncrypt } from '../utils/index.js'

/**
 * Encrypt page
 *
 * 加密页面，将页面的密码转换为加密后的哈希值并存储在页面数据中
 */
export async function encryptPage(
  page: Page<ThemePageData>,
): Promise<void> {
  const password = toArray(page.frontmatter.password) as string[]
  if (password.length) {
    page.data._e = (await pMap(password, item => genEncrypt(item))).join(':')
  }
  deleteKey(page.frontmatter, 'password')
}
