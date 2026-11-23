import type { Page } from 'vuepress'
import type { MarkdownDemoEnv } from '../../shared/index.js'
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
        // 仅排除真正的父级引用（`..` / `../xxx`）与跨盘符的绝对路径；
        // `..assets/Basic.vue` 这类以 `..` 开头的目录名仍在页面目录内，需要保留。
        // Exclude only real parent references (`..` / `../xxx`) and cross-drive absolute
        // paths: a directory literally named `..assets` stays inside the page directory.
        .filter(relative =>
          relative
          && relative !== '..'
          && !relative.startsWith('../')
          && !path.isAbsolute(relative))
    : []

  if (gitIncludes.length) {
    ((page.frontmatter.gitInclude as string[] | undefined) ??= []).push(...gitIncludes)
  }
}
