import type { App } from 'vuepress/core'
import type { Markdown } from 'vuepress/markdown'
import type { EncryptSnippetOptions } from '../../shared/encrypt'
import { getRandomValues } from 'node:crypto'
import { debounce } from '@pengzhanbo/utils'
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
export function encryptPlugin(app: App, md: Markdown, options: EncryptSnippetOptions): void {
  const encrypted: Set<string> = new Set()
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
  const writeEntry = debounce(150, async () => {
    let content = `export default {\n`
    for (const hash of encrypted) {
      content += `  '${hash}': () => import('./${hash}.js' /* webpackChunkName: "snippet-${hash}" */),\n`
    }
    content += '\n}\n'
    app.writeTemp(entryFile, content)
  })

  if (!fs.existsSync(app.dir.temp(entryFile))) {
    // Initialize
    app.writeTemp(entryFile, 'export default {}\n')
  }

  const localKeys = Object.keys(app.options.locales || {}).filter(key => key !== '/')

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
    const rendered = md.render(content, cleanMarkdownEnv(env))
    const _pwd = password || pwd || options.password

    if (!_pwd) {
      logger.warn(`${colors.cyan('[encrypt snippet]')} ${colors.green('::: encrypt')} container missing password. ${colors.gray(`(${env.filePathRelative})`)}`)
      return rendered
    }

    const contentHash = hash(content)
    encrypted.add(contentHash)

    const salt = getRandomValues(new Uint8Array(16))
    const iv = getRandomValues(new Uint8Array(16))

    writeEntry()
    writeTemp(contentHash, rendered, { salt, iv, password: String(_pwd) })

    const data = encodeData(JSON.stringify({
      hash: contentHash,
      salt: Array.from(salt),
      iv: Array.from(iv),
    }))

    return `<VPEncryptSnippet data="${data}" hint="${hint || ''}" path-locale="${getLocale(env.filePathRelative)}" />`
  })
}
