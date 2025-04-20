import type { MarkdownEnv } from 'vuepress/markdown'

export interface CleanMarkdownEnv extends MarkdownEnv {
  references?: unknown
  abbreviations?: unknown
  annotations?: unknown
}

export function cleanMarkdownEnv(env: CleanMarkdownEnv): CleanMarkdownEnv {
  return {
    base: env.base,
    filePath: env.filePath,
    filePathRelative: env.filePathRelative,
    references: env.references,
    abbreviations: env.abbreviations,
    annotations: env.annotations,
  }
}
