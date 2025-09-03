import type { MarkdownEnv } from 'vuepress/markdown'

export interface CleanMarkdownEnv extends MarkdownEnv {
  references?: unknown
  abbreviations?: unknown
  annotations?: unknown
}

const WHITE_LIST = ['base', 'filePath', 'filePathRelative', 'references', 'abbreviations', 'annotations'] as const

type WhiteListUnion = (typeof WHITE_LIST)[number]

export function cleanMarkdownEnv(env: CleanMarkdownEnv, excludes: WhiteListUnion[] = []): CleanMarkdownEnv {
  const result: CleanMarkdownEnv = {}
  for (const key of WHITE_LIST) {
    if (excludes.includes(key))
      continue
    result[key] = env[key] as string
  }
  return result
}
