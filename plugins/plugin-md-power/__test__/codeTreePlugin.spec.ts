import type { App, Page } from 'vuepress/core'
import type { MarkdownEnv } from 'vuepress/markdown'
import type { CodeTreeOptions } from '../src/shared/index.js'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import MarkdownIt from 'markdown-it'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import {
  codeTreePlugin,
  extendsPageWithCodeTree,
  EXTENSION_IMAGES,
  initLoaders,
  loadCodeContent,
} from '../src/node/container/codeTree.js'
import { logger } from '../src/node/utils/logger.js'

const FENCE = '`'.repeat(6)

// 测试在测试目录内创建临时文件。
// `.tmp` 目录已被 gitignore 忽略，并在测试结束后清理。
const TEST_TMP_DIR = fileURLToPath(new URL('.tmp', import.meta.url))

// ─── helpers ──────────────────────────────────────────────────────────────────

function mkTmpDir(): string {
  return fs.mkdtempSync(path.join(TEST_TMP_DIR, 'code-tree-'))
}

function createApp(sourceDir: string, publicDir: string): App {
  return {
    dir: {
      source: (...args: string[]) => path.resolve(sourceDir, ...args),
      public: () => publicDir,
    },
  } as unknown as App
}

function createMarkdown(app: App, options?: CodeTreeOptions): MarkdownIt {
  const md = new MarkdownIt({
    // mimic vuepress markdown configuration so raw html (e.g. <img>) is kept
    html: true,
  })
  // mimic vuepress markdown environment where an `import_code` rule exists
  md.use((md) => {
    md.block.ruler.before('code', 'import_code', () => false)
    md.renderer.rules.import_code = () => ''
  })
  codeTreePlugin(md, app, options)
  return md
}

function writeTree(root: string, files: Record<string, string>): void {
  for (const [rel, content] of Object.entries(files)) {
    const abs = path.join(root, rel)
    fs.mkdirSync(path.dirname(abs), { recursive: true })
    fs.writeFileSync(abs, content)
  }
}

// ─── shared fixture ───────────────────────────────────────────────────────────

let baseDir: string
let sourceDir: string
let publicDir: string
let app: App
let env: MarkdownEnv

beforeAll(() => {
  fs.mkdirSync(TEST_TMP_DIR, { recursive: true })
  baseDir = mkTmpDir()
  sourceDir = path.join(baseDir, 'source')
  // public dir is nested inside source dir so both public & non-public
  // image branches can be exercised through embed syntax.
  publicDir = path.join(sourceDir, 'public')
  fs.mkdirSync(publicDir, { recursive: true })
  app = createApp(sourceDir, publicDir)
  env = {
    filePath: path.join(sourceDir, 'index.md'),
    filePathRelative: 'index.md',
  }

  writeTree(sourceDir, {
    'examples/src/index.ts': 'const a = 1\n',
    'examples/src/utils.ts': 'export const b = 2\n',
    'examples/src/components/App.vue': '<template />\n',
    'examples/src/assets/logo.png': '\x89PNG fake png',
    'examples/src/data.unknownext': 'unknown binary content',
    'examples/src/readme.md': '# Readme\n',
    'examples/src/.editorconfig': 'root = true\n',
    'examples/src/.env': 'KEY=value\n',
    'examples/src/.eslintrc': '{}\n',
    'examples/src/skip.txt': 'should be ignored\n',
    'public/imgs/banner.png': '\x89PNG banner',
    'public/imgs/badge.jpg': 'fake jpg',
  })
})

afterAll(() => {
  fs.rmSync(TEST_TMP_DIR, { recursive: true, force: true })
})

// ─── loadCodeContent ──────────────────────────────────────────────────────────

describe('loadCodeContent', () => {
  it('should use the file extension as language when lang is not provided', () => {
    const dir = mkTmpDir()
    const filePath = path.join(dir, 'index.ts')
    fs.writeFileSync(filePath, '\n  const a = 1  \n')
    const out = loadCodeContent({
      path: 'index.ts',
      absolutePath: filePath,
      relativePath: 'index.ts',
      extname: 'ts',
      basename: 'index.ts',
    })
    fs.rmSync(dir, { recursive: true, force: true })

    expect(out.startsWith(`${FENCE}ts`)).toBe(true)
    expect(out).toContain('title="index.ts"')
    expect(out).toContain('const a = 1')
    expect(out).not.toContain('\n  const a = 1  \n')
  })

  it('should use the provided lang override', () => {
    const dir = mkTmpDir()
    const filePath = path.join(dir, 'config')
    fs.writeFileSync(filePath, 'key = value')
    const out = loadCodeContent({
      path: 'config',
      absolutePath: filePath,
      relativePath: 'config',
      extname: '',
      basename: 'config',
    }, 'toml')
    fs.rmSync(dir, { recursive: true, force: true })

    expect(out.startsWith(`${FENCE}toml`)).toBe(true)
    expect(out).toContain('key = value')
  })
})

// ─── image extension list ─────────────────────────────────────────────────────

describe('image extensions', () => {
  it('should include common browser image extensions', () => {
    expect(EXTENSION_IMAGES).toContain('png')
    expect(EXTENSION_IMAGES).toContain('jpg')
    expect(EXTENSION_IMAGES).toContain('svg')
    expect(EXTENSION_IMAGES).toContain('webp')
  })
})

// ─── initLoaders ──────────────────────────────────────────────────────────────

describe('initLoaders', () => {
  it('should return built-in loaders when no custom loaders are provided', () => {
    const loaders = initLoaders()
    expect(loaders).toHaveLength(5)
    const fnBased = loaders.filter(l => l.filter)
    const globBased = loaders.filter(l => l.matcher)
    expect(fnBased).toHaveLength(4)
    expect(globBased).toHaveLength(1)
    for (const l of fnBased)
      expect(l.filter).toBeTypeOf('function')
    for (const l of globBased)
      expect(l.matcher).toBeTypeOf('function')
  })

  it('should prepend user loader with function filter', () => {
    const loaders = initLoaders([
      {
        filter: file => file.basename === 'a.md',
        load: () => 'A',
      },
    ])
    expect(loaders).toHaveLength(6)
    expect(loaders[0].filter).toBeTypeOf('function')
    expect(loaders[0].matcher).toBeUndefined()
    expect(loaders[0].load!({} as any, app)).toBe('A')
  })

  it('should prepend user loaders with glob filters as matchers', () => {
    const loaders = initLoaders([
      { filter: ['**/*.md'], load: () => 'B' },
      { filter: '*.js', load: () => 'C' },
    ])
    expect(loaders).toHaveLength(7)
    expect(loaders[0].filter).toBeUndefined()
    expect(loaders[0].matcher).toBeTypeOf('function')
    expect(loaders[1].filter).toBeUndefined()
    expect(loaders[1].matcher).toBeTypeOf('function')
  })

  it('should map matcher result for glob filters', () => {
    const loaders = initLoaders([
      { filter: '**/*.md', load: () => 'MD' },
    ])
    const item = {
      path: 'readme.md',
      absolutePath: '/x/readme.md',
      relativePath: 'readme.md',
      extname: 'md',
      basename: 'readme.md',
    }
    expect(loaders[0].matcher?.(item.path)).toBe(true)
    expect(loaders[0].matcher?.('index.ts')).toBe(false)
  })
})

// ─── extendsPageWithCodeTree ──────────────────────────────────────────────────

describe('extendsPageWithCodeTree', () => {
  it('should push codeTreeFiles into page deps', () => {
    const page = {
      markdownEnv: { codeTreeFiles: ['/a.ts', '/b.ts'] },
      deps: [] as string[],
    } as unknown as Page
    extendsPageWithCodeTree(page)
    expect(page.deps).toEqual(['/a.ts', '/b.ts'])
  })

  it('should do nothing when codeTreeFiles is empty', () => {
    const page = { markdownEnv: { codeTreeFiles: [] }, deps: [] } as unknown as Page
    extendsPageWithCodeTree(page)
    expect(page.deps).toEqual([])
  })

  it('should do nothing when markdownEnv has no codeTreeFiles', () => {
    const page = { markdownEnv: {}, deps: [] } as unknown as Page
    extendsPageWithCodeTree(page)
    expect(page.deps).toEqual([])
  })
})

// ─── codeTreePlugin > container syntax ────────────────────────────────────────

const F = '```'

describe('codeTreePlugin > container syntax', () => {
  it('should render a basic container with file tree', () => {
    const code = `\
::: code-tree title="My Project" height="400px"
${F} ts title="src/index.ts"
export {}
${F}
${F} css title="src/style.css"
body {}
${F}
${F} js title="src/main.ts" :active
{}
${F}
:::
`
    const html = createMarkdown(app).render(code, env)

    expect(html).toContain('<VPCodeTree')
    expect(html).toContain('title="My Project"')
    expect(html).toContain('height="400px"')
    // :active wins over files[0]
    expect(html).toContain('entry-file="src/main.ts"')
    expect(html).toContain('filename="src"')
    expect(html).toContain('filename="index.ts"')
    expect(html).toContain('filename="style.css"')
    expect(html).toContain('filename="main.ts"')
    expect(html).toContain('</VPCodeTree>')
  })

  it('should use entry attribute when no fence is active', () => {
    const code = `\
::: code-tree title="Demo" entry="src/style.css"
${F} ts title="src/index.ts"
export {}
${F}
${F} css title="src/style.css"
body {}
${F}
:::
`
    const html = createMarkdown(app).render(code, env)
    expect(html).toContain('entry-file="src/style.css"')
  })

  it('should fall back to the first file when no entry is given', () => {
    const code = `\
::: code-tree
${F} ts title="src/index.ts"
export {}
${F}
${F} css title="src/style.css"
body {}
${F}
:::
`
    const html = createMarkdown(app).render(code, env)
    expect(html).toContain('entry-file="src/index.ts"')
  })

  it('should render numeric height with unit', () => {
    const code = `\
::: code-tree height="500"
${F} ts title="src/index.ts"
export {}
${F}
:::
`
    const html = createMarkdown(app).render(code, env)
    expect(html).toContain('height="500px"')
  })

  it('should fall back to options.height when height attr is missing', () => {
    const code = `\
::: code-tree
${F} ts title="src/index.ts"
export {}
${F}
:::
`
    const html = createMarkdown(app, { height: 300 }).render(code, env)
    expect(html).toContain('height="300px"')
  })

  it('should omit height when neither attr nor option is provided', () => {
    const code = `\
::: code-tree title="No Height"
${F} ts title="src/index.ts"
export {}
${F}
:::
`
    const html = createMarkdown(app).render(code, env)
    expect(html).toContain('title="No Height"')
    expect(html).not.toContain('height=')
  })

  it('should render simple icons when icon="simple"', () => {
    const code = `\
::: code-tree icon="simple"
${F} ts title="src/index.ts"
export {}
${F}
${F} md title="docs/README.md"
# title
${F}
:::
`
    const html = createMarkdown(app).render(code, env)
    expect(html).toContain('default-folder')
    expect(html).toContain('default-file')
  })

  it('should use options.icon for simple mode', () => {
    const code = `\
::: code-tree
${F} ts title="src/index.ts"
export {}
${F}
:::
`
    const html = createMarkdown(app, { icon: 'simple' }).render(code, env)
    expect(html).toContain('default-folder')
    expect(html).toContain('default-file')
  })

  it('should render colored icon names by default', () => {
    const code = `\
::: code-tree
${F} ts title="src/index.ts"
export {}
${F}
:::
`
    const html = createMarkdown(app).render(code, env)
    // colored mode renders file icons via getFileIcon
    expect(html).toContain('<VPIcon provider="iconify" name="')
    expect(html).not.toContain('default-folder')
  })

  it('should skip fences without a title', () => {
    const code = `\
::: code-tree title="Skip Untitled"
${F} ts
export {}
${F}
${F} ts title="src/index.ts"
const a = 1
${F}
:::
`
    const html = createMarkdown(app).render(code, env)
    // untitled fence contributes no file to the tree
    expect(html).toContain('entry-file="src/index.ts"')
    expect(html).toContain('filename="src"')
    expect(html).toContain('filename="index.ts"')
    // untitled fence content still renders as plain code
    expect(html).toContain('export {}')
  })

  it('should render empty container gracefully', () => {
    const html = createMarkdown(app).render('::: code-tree\n:::\n', env)
    expect(html).toContain('<VPCodeTree')
    expect(html).toContain('</VPCodeTree>')
  })

  it('should skip non-fence tokens when collecting files', () => {
    const code = `\
::: code-tree title="With Text"
some paragraph text

${F} ts title="src/index.ts"
const a = 1
${F}
:::
`
    const html = createMarkdown(app).render(code, env)
    // paragraph token is ignored, only the titled fence becomes a file
    expect(html).toContain('entry-file="src/index.ts"')
    expect(html).toContain('some paragraph text')
  })

  it('should omit height when options.height is empty string', () => {
    const code = `\
::: code-tree title="Empty Height"
${F} ts title="src/index.ts"
export {}
${F}
:::
`
    const html = createMarkdown(app, { height: '' }).render(code, env)
    expect(html).toContain('title="Empty Height"')
    expect(html).not.toContain('height=')
  })

  it('should handle multiple folders nesting', () => {
    const code = `\
::: code-tree title="Nested"
${F} ts title="src/components/Header.vue"
<t></t>
${F}
${F} ts title="src/components/Footer.vue"
<f></f>
${F}
${F} ts title="src/index.ts"
export {}
${F}
${F} json title="package.json"
{}
${F}
:::
`
    const html = createMarkdown(app).render(code, env)
    expect(html).toContain('filename="src"')
    expect(html).toContain('filename="components"')
    expect(html).toContain('filename="Header.vue"')
    expect(html).toContain('filename="Footer.vue"')
    expect(html).toContain('filename="package.json"')
  })
})

// ─── codeTreePlugin > embed syntax ────────────────────────────────────────────

describe('codeTreePlugin > embed syntax', () => {
  it('should render an embedded directory with default loaders', () => {
    const md = createMarkdown(app)
    const html = md.render('@[code-tree](./examples/src)', env)

    expect(html).toContain('<VPCodeTree')
    expect(html).toContain('filename="components"')
    expect(html).toContain('filename="index.ts"')
    expect(html).toContain('filename="readme.md"')
    // supports source code → fenced code block
    expect(html).toContain('const a = 1')
    // .editorconfig → toml
    expect(html).toContain('root = true')
    // .env → txt (dot files)
    expect(html).toContain('KEY=value')
    // .eslintrc → json
    expect(html).toContain('{}')
    // non-public image → relative src
    expect(html).toContain('<img src="examples/src/assets/logo.png" alt="logo.png" data-title="assets/logo.png">')
    // unknown file type → nothing rendered, still part of file tree
    expect(html).toContain('filename="data.unknownext"')
    expect(html).not.toContain('unknown binary content')
    // collects files into env codeTreeFiles
    expect((env as any).codeTreeFiles?.length).toBeGreaterThan(0)
  })

  it('should render images in public dir with public path', () => {
    const md = createMarkdown(app)
    const html = md.render('@[code-tree](/public/imgs)', env)

    expect(html).toContain('<VPCodeTree')
    expect(html).toContain('<img src="/imgs/banner.png" alt="banner.png" data-title="banner.png">')
    expect(html).toContain('<img src="/imgs/badge.jpg" alt="badge.jpg" data-title="badge.jpg">')
  })

  it('should default entry-file to the first (deepest) file', () => {
    const html = createMarkdown(app).render('@[code-tree](./examples/src)', env)
    expect(html).toMatch(/entry-file="(?:components\/App\.vue|assets\/logo\.png)"/)
  })

  it('should pass through meta attributes', () => {
    const html = createMarkdown(app).render(
      '@[code-tree title="Docs" entry="index.ts" height="500" showSidebar](./examples/src)',
      env,
    )
    expect(html).toContain('title="Docs"')
    expect(html).toContain('entry-file="index.ts"')
    expect(html).toContain('height="500px"')
    expect(html).toContain('show-sidebar')
  })

  it('should fall back to options.height for embed syntax', () => {
    const html = createMarkdown(app, { height: 480 }).render(
      '@[code-tree](./examples/src)',
      env,
    )
    expect(html).toContain('height="480px"')
  })

  it('should omit height for embed syntax when options.height is empty string', () => {
    const html = createMarkdown(app, { height: '' }).render(
      '@[code-tree](./examples/src)',
      env,
    )
    expect(html).toContain('<VPCodeTree')
    expect(html).not.toContain('height=')
  })

  it('should ignore files matched by options.ignores', () => {
    const md = createMarkdown(app, { ignores: ['**/skip.txt'] })
    const html = md.render('@[code-tree](./examples/src)', env)
    expect(html).not.toContain('skip.txt')
    expect(html).not.toContain('should be ignored')
  })

  it('should support custom loader with function filter, taking precedence over defaults', () => {
    const md = createMarkdown(app, {
      loaders: [
        {
          filter: file => file.basename === 'index.ts',
          load: file => `CUSTOM-${file.path}`,
        },
      ],
    })
    const html = md.render('@[code-tree](./examples/src)', env)
    expect(html).toContain('CUSTOM-index.ts')
    expect(html).not.toContain('const a = 1')
  })

  it('should support custom loader with glob filter', () => {
    const md = createMarkdown(app, {
      loaders: [
        {
          filter: '**/*.md',
          load: () => 'GLOB-MD',
        },
      ],
    })
    const html = md.render('@[code-tree](./examples/src)', env)
    expect(html).toContain('GLOB-MD')
    expect(html).not.toContain('# Readme')
  })

  it('should skip files when loader throws and log error', () => {
    const spy = vi.spyOn(logger, 'error')
    const md = createMarkdown(app, {
      loaders: [
        {
          filter: () => true,
          load: () => {
            throw new Error('boom')
          },
        },
      ],
    })
    const html = md.render('@[code-tree](./examples/src)', env)
    expect(spy).toHaveBeenCalledWith(
      '[code-tree container]',
      expect.stringContaining('Error loading file'),
    )
    // loaders return '' on error, file tree still rendered
    expect(html).toContain('<VPCodeTree')
    expect(html).not.toContain('Error loading file')
    spy.mockRestore()
  })

  it('should handle invalid target directory with warning', () => {
    const spy = vi.spyOn(logger, 'warn')
    const html = createMarkdown(app).render('@[code-tree](./missing)', env)
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining('Invalid code-tree target directory'),
    )
    expect(html).toContain('@[code-tree](./missing)')
    expect(html).toContain('Invalid target directory')
    spy.mockRestore()
  })
})
