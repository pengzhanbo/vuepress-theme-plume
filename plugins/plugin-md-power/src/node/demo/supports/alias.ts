export function normalizeAlias(info: string): string {
  const [lang] = info.trim().split(/\s+|:|\{/)
  switch (lang) {
    case 'vue':
      return 'vue'
    case 'js':
    case 'javascript':
      return 'js'
    case 'ts':
    case 'typescript':
      return 'ts'
    case 'stylus':
    case 'styl':
      return 'stylus'
    case 'md':
    case 'markdown':
      return 'md'
  }
  return lang
}
