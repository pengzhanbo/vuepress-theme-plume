import type { Page } from 'vuepress/core'
import type { ThemePageData } from '../../shared/index.js'
import { deleteKey, isNumber, isString, toArray } from '@pengzhanbo/utils'
import pMap from 'p-map'
import { genEncrypt, logger } from '../utils/index.js'

/**
 * Encrypt page
 *
 * 加密页面，将页面的密码转换为加密后的哈希值并存储在页面数据中
 */
export async function encryptPage(
  page: Page<ThemePageData>,
): Promise<void> {
  const rawPassword = toArray(page.frontmatter.password)
  const password = rawPassword
    .filter(item => isString(item) || isNumber(item))
    .map(item => `${item}`)
    .filter(item => item.length > 0)

  if (password.length) {
    // bcrypt 是 CPU 密集型操作（costFactor 为 11），限制并发避免打满事件循环。
    // Bcrypt is CPU intensive (cost factor 11), so its concurrency is bounded.
    page.data._e = (await pMap(password, item => genEncrypt(item), { concurrency: 4 })).join(':')
  }
  else if (rawPassword.length) {
    // An empty password still produces a valid bcrypt hash, but the client always rejects
    // empty input, which would lock the page forever. So it is ignored with a warning instead.
    // 空密码依然会生成合法的 bcrypt 哈希，但客户端始终拒绝空输入，会导致页面永久无法解锁。
    // 因此这里忽略该密码并给出提示。
    logger.warn(`[encrypt] the password of page ${page.filePathRelative} is empty or invalid, it has been ignored. The page will NOT be encrypted.`)
  }

  deleteKey(page.frontmatter, 'password')
}
