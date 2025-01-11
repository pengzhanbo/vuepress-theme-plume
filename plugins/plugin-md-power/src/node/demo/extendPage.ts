import type { Page } from 'vuepress'
import type { MarkdownDemoEnv } from '../../shared/demo.js'

export function extendsPageWithDemo(page: Page): void {
  const markdownEnv = page.markdownEnv as MarkdownDemoEnv
  const demoFiles = markdownEnv.demoFiles ?? []

  page.deps.push(
    ...demoFiles
      .filter(({ type }) => type === 'markdown')
      .map(({ path }) => path),
  )

  ;((page.frontmatter.gitInclude as string[] | undefined) ??= []).push(
    ...demoFiles.filter(({ gitignore }) => !gitignore).map(({ path }) => path),
  )
}
