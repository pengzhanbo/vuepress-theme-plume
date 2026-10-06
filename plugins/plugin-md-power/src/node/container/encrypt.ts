import type { App } from 'vuepress/core'
import type { Markdown } from 'vuepress/markdown'
import type { EncryptSnippetOptions } from '../../shared/encrypt'
import { getRandomValues } from 'node:crypto'
import { debounce, objectKeys } from '@pengzhanbo/utils'
import { encodeData, ensureLeadingSlash } from '@vuepress/helper'
import { colors, fs, hash } from 'vuepress/utils'
import { cleanMarkdownEnv } from '../utils/cleanMarkdownEnv'
import { encryptContent } from '../utils/encryptContent'
import { logger } from '../utils/logger'
import { createContainerSyntaxPlugin } from './createContainer'

/**
 * Encryption options
 *
 * 加密选项
 */
interface EncryptOptions {
  password: string
  salt: Uint8Array
  iv: Uint8Array
}

/**
 * Encrypt plugin - Enable encrypted content container
 *
 * 加密插件 - 启用加密内容容器
 *
 * @param app - VuePress app / VuePress 应用
 * @param md - Markdown instance / Markdown 实例
 * @param options - Encrypt snippet options / 加密片段选项
 */
export function encryptPlugin(
  app: App,
  md: Markdown,
  options: EncryptSnippetOptions,
): () => Promise<void> {
  const encrypted: Set<string> = new Set()
  const pending: Promise<unknown>[] = []
  const entryFile = 'internal/encrypt-snippets/index.js'

  /**
   * Write encrypted content to temp file
   *
   * 将加密内容写入临时文件
   */
  const writeTemp = async (
    hash: string,
    content: string,
    options: EncryptOptions,
  ) => {
    const encrypted = await encryptContent(content, options)
    await app.writeTemp(`internal/encrypt-snippets/${hash}.js`, `export default ${JSON.stringify(encrypted)}`)
  }

  /**
   * Write entry file with all encrypted snippets
   *
   * 写入包含所有加密片段的入口文件
   */
  const writeEntryFile = async () => {
    let content = `export default {\n`
    for (const hash of encrypted) {
      content += `  '${hash}': () => import('./${hash}.js' /* webpackChunkName: "snippet-${hash}" */),\n`
    }
    content += '\n}\n'
    await app.writeTemp(entryFile, content)
  }

  // Debounced entry file writing for incremental updates during rendering (dev/HMR).
  // 防抖写入入口文件，用于渲染过程中的增量更新（开发/HMR）。
  let entryWrite: Promise<void> | undefined
  const writeEntry = debounce(150, () => {
    entryWrite = writeEntryFile()
  })

  if (!fs.existsSync(app.dir.temp(entryFile))) {
    // Initialize
    pending.push(app.writeTemp(entryFile, 'export default {}\n'))
  }

  const localKeys = objectKeys(app.options.locales || {}).filter(key => key !== '/')

  /**
   * Get locale from relative path
   *
   * 从相对路径获取本地化
   */
  const getLocale = (relativePath: string) => {
    const relative = ensureLeadingSlash(relativePath)
    return localKeys.find(key => relative.startsWith(key)) || '/'
  }

  createContainerSyntaxPlugin(md, 'encrypt', (tokens, index, _, env) => {
    const { meta, content } = tokens[index]
    const { password, pwd, hint } = meta as { password?: string, pwd?: string, hint?: string }
    const _pwd = password || pwd || options.password

    if (!_pwd) {
      // Never fall back to plaintext: the author expects the content to be protected,
      // silently rendering it would leak the content. Fail loudly and hide the content.
      // 绝不降级为明文：作者期望内容被保护，静默渲染明文会导致内容泄露。
      // 因此这里显式报错，并隐藏该片段的内容。
      logger.error(`${colors.cyan('[encrypt snippet]')} ${colors.green('::: encrypt')} container missing password, its content is NOT encrypted and has been hidden. ${colors.gray(`(${env.filePathRelative})`)}`)
      return `<div class="vp-encrypt-error" role="alert">[encrypt snippet] missing password, the content is not rendered. (${md.utils.escapeHtml(env.filePathRelative || '')})</div>`
    }

    const rendered = md.render(content, cleanMarkdownEnv(env))

    // The password is part of the hash: two containers with identical content but
    // different passwords must not share the same temp file, otherwise the later one
    // overwrites the former and both can only be unlocked with a single password.
    // 密码参与哈希计算：内容相同但密码不同的两个容器不能共用同一个临时文件，
    // 否则后写入的会覆盖先写入的，导致两处只能使用同一个密码解锁。
    const contentHash = hash(`${_pwd}:${content}`)
    encrypted.add(contentHash)

    const salt = getRandomValues(new Uint8Array(16))
    const iv = getRandomValues(new Uint8Array(16))

    writeEntry()
    pending.push(writeTemp(contentHash, rendered, { salt, iv, password: String(_pwd) }))

    const data = encodeData(JSON.stringify({
      hash: contentHash,
      salt: Array.from(salt),
      iv: Array.from(iv),
    }))

    return `<VPEncryptSnippet data="${data}" hint="${md.utils.escapeHtml(hint || '')}" path-locale="${getLocale(env.filePathRelative)}" />`
  })

  // Wait for all pending writes and flush the entry file before build ends.
  // 等待所有待处理的写入完成，并在构建结束前收敛写入入口文件。
  return async () => {
    await Promise.all(pending)
    writeEntry.cancel()
    await entryWrite
    await writeEntryFile()
  }
}
