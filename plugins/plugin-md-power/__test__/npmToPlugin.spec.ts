import type { NpmToOptions } from '../src/shared/npmTo.js'
import MarkdownIt from 'markdown-it'
import { describe, expect, it } from 'vitest'
import { codeTabs } from '../src/node/container/codeTabs.js'
import { npmToPlugins, parseLine } from '../src/node/container/npmTo.js'

function createMarkdown(options?: NpmToOptions) {
  const md = new MarkdownIt()
  md.options.highlight = str => `<pre><code>${str}</code></pre>`
  const fence = md.renderer.rules.fence!
  md.renderer.rules.fence = (...args) => `<div class="language-lang">${fence(...args)}</div>`

  md.use(codeTabs).use(npmToPlugins, options)

  return md
}

const FENCE = '```'

describe('npmToPlugin', () => {
  const code = `\
::: npm-to
${FENCE}sh
${FENCE}
:::

::: npm-to
${FENCE}sh
npm install
${FENCE}
:::

::: npm-to
${FENCE}shell
npm install
${FENCE}
:::

::: npm-to
${FENCE}bash
npm install
${FENCE}
:::

::: npm-to
${FENCE}sh
cross-env NODE_ENV=production npm run docs
${FENCE}
:::

::: npm-to
${FENCE}sh
npm i -D package1 package2
npm i --save-peer package3
npm run docs
${FENCE}
:::

::: npm-to
${FENCE}sh
npm install && npm run docs
mkdir foo
${FENCE}
:::

::: npm-to
${FENCE}sh
npm run docs -- --clean-cache --clean-temp

${FENCE}
:::

::: npm-to tabs=","
${FENCE}sh
npm create vuepress-theme-plume@latest
${FENCE}
:::

::: npm-to tabs="npm,pnpm,yarn,bun,deno"
${FENCE}sh
npx vp-update
${FENCE}
:::

::: npm-to
${FENCE}sh
mkdir foo
${FENCE}
:::

::: npm-to
anything
${FENCE}sh
${FENCE}
:::
`
  it('should work with default options', () => {
    const md = createMarkdown()

    expect(md.render(code)).toMatchSnapshot()
  })

  it('should work width options: { tabs: [npm, yarn, pnpm] }', () => {
    const md = createMarkdown({ tabs: ['npm', 'yarn', 'pnpm'] })

    expect(md.render(code)).toMatchSnapshot()
  })

  it('should work width options: [npm, yarn, pnpm]', () => {
    const md = createMarkdown(['npm', 'yarn', 'pnpm'])

    expect(md.render(code)).toMatchSnapshot()
  })
})

describe('parseLine', () => {
  it('should work', () => {
    expect(parseLine('npm install')).toMatchObject({ env: '', cli: 'npm install', cmd: '' })
    expect(parseLine('npx vp-update')).toMatchObject({ env: '', cli: 'npx', cmd: 'vp-update' })
    expect(parseLine('npx vp-update --foo')).toMatchObject({ env: '', cli: 'npx', cmd: 'vp-update', scriptArgs: '--foo' })
    expect(parseLine('npm run docs')).toMatchObject({ env: '', cli: 'npm run', cmd: 'docs' })
    expect(parseLine('npm i -D package1 -- --foo'))
      .toMatchObject({ env: '', cli: 'npm i', cmd: 'package1', args: '-D', scriptArgs: '--foo' })
    expect(parseLine('npm install -y')).toMatchObject({ env: '', cli: 'npm install', cmd: '', args: '-y' })
    expect(parseLine('npm create vuepress-theme-plume my-blog')).toMatchObject({ env: '', cli: 'npm create', cmd: 'vuepress-theme-plume my-blog' })
    expect(parseLine('npm create "vuepress-theme-plume my-blog"')).toMatchObject({ env: '', cli: 'npm create', cmd: '"vuepress-theme-plume my-blog"' })
    expect(parseLine('npm create vuepress-theme-plume my-blog --foo -B')).toMatchObject({ env: '', cli: 'npm create', cmd: 'vuepress-theme-plume my-blog', args: '--foo -B' })

    expect(parseLine('npm run -w="my-workspace" docs')).toMatchObject({ env: '', cli: 'npm run', cmd: 'docs', args: '-w="my-workspace"' })
  })

  it('should not match', () => {
    expect(parseLine('mkdir foo')).toBe(false)
    expect(parseLine('')).toBe(false)
  })
})
