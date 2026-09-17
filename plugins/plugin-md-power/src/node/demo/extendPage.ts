import type { Page } from 'vuepress'
import type { MarkdownDemoEnv } from '../../shared/demo.js'
import { ensureEndingSlash } from 'vuepress/shared'
import { path } from 'vuepress/utils'

export function extendsPageWithDemo(page: Page): void {
  const markdownEnv = page.markdownEnv as MarkdownDemoEnv
  const demoFiles = markdownEnv.demoFiles ?? []

  const deps = demoFiles
    .filter(({ type }) => type === 'markdown')
    .map(({ path }) => path)

  if (deps.length) {
    page.deps.push(...deps)
  }

  const gitIncludes = demoFiles
    .filter(({ gitignore }) => !gitignore)
    .map(demo => page.filePath && demo.path.replace(ensureEndingSlash(path.dirname(page.filePath)), ''))
    .filter(item => item && item[0] !== '/') as string[]

  if (gitIncludes.length) {
    ((page.frontmatter.gitInclude as string[] | undefined) ??= []).push(...gitIncludes)
  }
}
