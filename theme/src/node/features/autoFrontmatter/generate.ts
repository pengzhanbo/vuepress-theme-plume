import type { MarkdownInfo } from '../markdown-source.js'
import { createFilter } from '../../utils/createFilter.js'
import { getRules } from './rules.js'

export async function generateMarkdownFrontmatter(info: MarkdownInfo) {
  const rules = getRules()
  const rule = rules.find(({ filter }) => createFilter(filter)(info.relativePath))

  if (rule) {
    info.data = await rule.handle(info.data as any, info) ?? info.data
  }
}
