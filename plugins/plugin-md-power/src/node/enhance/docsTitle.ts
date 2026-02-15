import type { Markdown, MarkdownEnv } from 'vuepress/markdown'

/**
 * Regular expression for matching h1 heading
 *
 * 匹配 h1 标题的正则表达式
 */
const REG_HEADING = /^#\s*?([^#\s].*)?\n/

/**
 * Docs title plugin - Extract h1 title from markdown to frontmatter
 *
 * 文档标题插件 - 从 markdown 中提取 h1 标题到 frontmatter
 *
 * Adapts to theme's document page title by extracting h1 title from markdown to frontmatter
 * and removing it from content to avoid duplicate display.
 *
 * 适配主题的文档页面标题，将 markdown 中的 h1 标题提取到 frontmatter 中，并将其删除，
 * 以避免重复显示标题。
 *
 * @param md - Markdown instance / Markdown 实例
 */
export function docsTitlePlugin(md: Markdown): void {
  const render = md.render.bind(md)
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

/**
 * Parse markdown source to separate frontmatter and content
 *
 * 解析 markdown 源文件，分离 frontmatter 和内容
 *
 * @param source - Markdown source / Markdown 源文件
 * @returns Object with matter and content / 包含 matter 和 content 的对象
 */
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
