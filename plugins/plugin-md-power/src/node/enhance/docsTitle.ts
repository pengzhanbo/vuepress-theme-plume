import type { Markdown, MarkdownEnv } from 'vuepress/markdown'

const REG_HEADING = /^#\s*?([^#\s].*)?\n/

/**
 * 适配 主题的 文档页面标题，将 markdown 中的 h1 标题提取到 frontmatter 中，并将其删除，
 * 以避免重复显示标题。
 */
export function docsTitlePlugin(md: Markdown): void {
  const render = md.render
  md.render = (source, env: MarkdownEnv) => {
    if (!env.filePathRelative)
      return render(source, env)

    let { matter, content } = parseSource(source.trim())
    let title = ''
    content = content.trim().replace(REG_HEADING, (_, match) => {
      title = match.trim()
      return ''
    })
    source = `${matter}\n${content}`
    const result = render(source, env)
    if (title) {
      env.frontmatter ??= {}
      env.frontmatter.title ??= title
    }
    return result
  }
}

function parseSource(source: string) {
  const char = '---'

  if (!source.startsWith(char)) {
    return { matter: '', content: source }
  }
  else {
    const end = source.indexOf(`\n${char}`)
    const len = char.length + 1
    return {
      matter: source.slice(0, end + len),
      content: source.slice(end + len),
    }
  }
}
