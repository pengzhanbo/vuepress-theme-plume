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

interface EncryptOptions {
  password: string
  salt: Uint8Array
  iv: Uint8Array
}

export function encryptPlugin(app: App, md: Markdown, options: EncryptSnippetOptions): void {
  const encrypted: Set<string> = new Set()
  const entryFile = 'internal/encrypt-snippets/index.js'

  const writeTemp = async (
    hash: string,
    content: string,
    options: EncryptOptions,
  ) => {
    const encrypted = await encryptContent(content, options)
    await app.writeTemp(`internal/encrypt-snippets/${hash}.js`, `export default ${JSON.stringify(encrypted)}`)
  }

  const writeEntry = debounce(150, async () => {
    let content = `export default {\n`
    for (const hash of encrypted) {
      content += `  '${hash}': () => import('./${hash}.js' /* webpackChunkName: "snippet-${hash}" */),\n`
    }
    content += '\n}\n'
    app.writeTemp(entryFile, content)
  })

  if (!fs.existsSync(app.dir.temp(entryFile))) {
    // 初始化
    app.writeTemp(entryFile, 'export default {}\n')
  }

  const localKeys = Object.keys(app.options.locales || {}).filter(key => key !== '/')
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
