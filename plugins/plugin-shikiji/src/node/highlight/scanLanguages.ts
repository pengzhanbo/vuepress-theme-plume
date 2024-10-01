import type { App } from 'vuepress'
import fs from 'node:fs/promises'
import path from 'node:path'
import fg from 'fast-glob'
import { bundledLanguages } from 'shiki'

const languages = Object.keys(bundledLanguages)
const RE_FENCE = /`{3,}[^`]*?(\s|$)/g

export async function scanLanguages(app: App): Promise<string[]> {
  const source = app.dir.source()
  const pattern = ['**/*.md', '!.vuepress', '!node_modules']
  const files = await fg(pattern, {
    cwd: source,
  })
  const langs = new Set<string>()

  for (const file of files) {
    const filepath = path.join(source, file)
    const content = await fs.readFile(filepath, 'utf-8')
    const matched = content.match(RE_FENCE)
    if (matched) {
      for (const match of matched) {
        let lang = match.replace(/`{3,}/, '').trim()
        if (lang.includes(':'))
          lang = lang.split(':')[0]
        if (lang)
          langs.add(lang)
      }
    }
  }

  return Array.from(langs).filter(lang => languages.includes(lang))
}
