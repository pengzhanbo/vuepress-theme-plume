import type { Token as JSToken } from 'js-tokens'
import type { ResolvedConfig } from 'tsdown'
import fs from 'node:fs'
import jsTokens from 'js-tokens'
import { format } from 'oxfmt'

export async function rewriteBundle({ entry, outDir, watch }: ResolvedConfig): Promise<void> {
  if (watch)
    return
  await Promise.all(Object.keys(entry).map(async (name) => {
    // 移除 js 文件中的注释，仅保留代码本身
    // IDE 提示可直接从 dts 文件中读取注释
    const file = `${outDir}/${name}.js`
    if (fs.existsSync(file))
      await fs.promises.writeFile(file, await formatCode(file, strip(await fs.promises.readFile(file, 'utf-8'))))

    // rolldown 会生成一些无关的 region 注释包围代码标识它们属于哪个源文件
    // 可以直接安全的移除它们
    const dts = `${outDir}/${name}.d.ts`
    if (fs.existsSync(dts))
      await fs.promises.writeFile(dts, await formatCode(dts, stripRegionComments(await fs.promises.readFile(dts, 'utf-8'))))
  }))
}

async function formatCode(filename: string, source: string): Promise<string> {
  const { code } = await format(filename, source, {
    singleQuote: true,
    quoteProps: 'consistent',
    newlineBetween: false,
    semi: false,
    bracketSpacing: false,
  })
  return code
}

/**
 * 移除代码中的注释，保留代码本身
 */
export function strip(code: string) {
  let result = ''

  for (const token of jsTokens(code, { jsx: false })) {
    result += stripFromToken(token)
  }

  return result
}

function stripFromToken(token: JSToken): string {
  if (token.type === 'SingleLineComment') {
    return ''
  }

  // 对于多行注释，如果包含 `webpackChunkName:`，则保留注释内容
  if (token.type === 'MultiLineComment' && !token.value.includes('webpackChunkName:')) {
    return ''
  }
  return token.value
}

export function stripRegionComments(code: string) {
  const result: string[] = []
  for (const line of code.split('\n')) {
    if (line.startsWith('//#region') || line.startsWith('//#endregion')) {
      continue
    }
    result.push(line)
  }
  return result.join('\n')
}
