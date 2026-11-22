import type { Page } from 'vuepress'
import type { MarkdownDemoEnv } from '../../shared/demo.js'
import { slash } from '@pengzhanbo/utils'
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

  const gitIncludes = page.filePath
    ? demoFiles
        .filter(({ gitignore }) => !gitignore)
        .map(demo => path.relative(path.dirname(page.filePath!), slash(demo.path)))
        .filter(relative => relative && !relative.startsWith('..') && !path.isAbsolute(relative))
    : []

  if (gitIncludes.length) {
    ((page.frontmatter.gitInclude as string[] | undefined) ??= []).push(...gitIncludes)
  }
}
