import type { App } from 'vuepress'

export interface ResolveContentOptions {
  name: string
  content: any
  before?: string
  after?: string
}

export function resolveContent(app: App, { name, content, before, after }: ResolveContentOptions): string {
  content = `${before ? `${before}\n` : ''}export const ${name} = ${JSON.stringify(content)}${after ? `\n${after}` : ''}`

  if (app.env.isDev) {
    const func = `update${name[0].toUpperCase()}${name.slice(1)}`
    content += `\n
if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.${func}) {
    __VUE_HMR_RUNTIME__.${func}(${name})
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ ${name} }) => {
    __VUE_HMR_RUNTIME__.${func}(${name})
  })
}
`
  }
  return content
}
