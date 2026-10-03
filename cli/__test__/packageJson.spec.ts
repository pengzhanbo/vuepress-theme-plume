import type { ResolvedData } from '../src/types.js'
import { describe, expect, it, vi } from 'vitest'
import { DeployType, Mode } from '../src/constants.js'
import { createPackageJson } from '../src/packageJson.js'

// 避免测试依赖真实环境：git 用户信息与包管理器版本探测均被替换为固定输出。
// Avoid relying on the real environment: git user info and package manager
// version detection are replaced with fixed output.
vi.mock('nano-spawn', () => ({
  default: vi.fn(async () => ({ output: '1.0.0' })),
}))

// 读取 CLI 自身的 package.json 依赖 dist 目录布局，在源码测试中替换为固定元数据。
// Reading the CLI's own package.json relies on the dist layout, so it is
// replaced with fixed metadata when testing against the source.
vi.mock('../src/utils/index.js', () => ({
  resolve: (...args: string[]) => args.join('/'),
  readJsonFile: vi.fn(async () => ({
    'version': '1.0.0',
    'engines': { node: '^20.19.0 || >=22.12.0' },
    'plume-deps': {
      'vuepress': '2.0.0',
      'http-server': '14.0.0',
      'vue': '3.5.0',
      'typescript': '5.0.0',
    },
  })),
}))

const base: ResolvedData = {
  displayLang: 'en-US',
  root: './my-project',
  siteName: 'My Vuepress Site',
  siteDescription: '',
  bundler: 'vite',
  multiLanguage: false,
  defaultLanguage: 'en-US',
  injectNpmScripts: true,
  deploy: DeployType.custom,
  git: false,
  install: false,
  packageManager: 'npm',
  docsDir: 'docs',
}

describe('createPackageJson', () => {
  it('should merge into an existing package.json in init mode', async () => {
    const pkg = {
      name: 'existing',
      scripts: { test: 'vitest' },
      devDependencies: { lodash: '4.0.0' },
    }

    const file = await createPackageJson(Mode.init, pkg, base)
    const json = JSON.parse(file.content)

    expect(file.filepath).toBe('package.json')
    // init 模式下需要与用户既有内容合并写入，因此允许覆盖。
    // In init mode the file is merged with the user's content, so overwrite is allowed.
    expect(file.overwrite).toBe(true)
    expect(json.name).toBe('existing')
    expect(json.type).toBeUndefined()
    expect(json.engines).toBeUndefined()
    expect(json.scripts.test).toBe('vitest')
    expect(json.scripts['docs:dev']).toBe('vuepress dev docs')
    expect(json.scripts['vp-update']).toBeUndefined()
    expect(json.devDependencies.lodash).toBe('4.0.0')
    expect(json.devDependencies.vuepress).toBe('2.0.0')
    expect(json.devDependencies['@vuepress/bundler-vite']).toBe('2.0.0')
    expect(json.devDependencies['vuepress-theme-plume']).toBe('1.0.0')
    expect(json.devDependencies.typescript).toBe('5.0.0')
  })

  it('should create a fresh package.json in create mode', async () => {
    const file = await createPackageJson(Mode.create, {}, base)
    const json = JSON.parse(file.content)

    expect(file.overwrite).toBe(false)
    expect(json.name).toBe('my-vuepress-site')
    expect(json.type).toBe('module')
    expect(json.version).toBe('1.0.0')
    // 生成工程的 Node 版本要求来自 CLI 自身 package.json 的 engines.node。
    // The generated project's Node requirement comes from the CLI's own
    // package.json `engines.node`.
    expect(json.engines).toEqual({ node: '^20.19.0 || >=22.12.0' })
    expect(json.scripts['vp-update']).toBe('npx vp-update')
  })

  it('should keep the user declared typescript version in init mode', async () => {
    const pkg = { devDependencies: { typescript: '~5.2.0' } }

    const file = await createPackageJson(Mode.init, pkg, base)
    const json = JSON.parse(file.content)

    // 用户已声明 typescript 时不应被默认版本覆盖。
    // A user declared typescript must not be overridden by the default version.
    expect(json.devDependencies.typescript).toBe('~5.2.0')
  })

  it('should skip script injection when injectNpmScripts is false', async () => {
    const file = await createPackageJson(Mode.init, {}, { ...base, injectNpmScripts: false })
    const json = JSON.parse(file.content)

    expect(json.scripts).toBeUndefined()
  })
})
