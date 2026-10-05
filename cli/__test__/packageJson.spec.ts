import type { ResolvedData } from '../src/types.js'
import spawn from 'nano-spawn'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DeployType, Mode } from '../src/constants.js'
import { createPackageJson } from '../src/packageJson.js'
import { getPackageManagerVersion, readJsonFile } from '../src/utils/index.js'

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
  readJsonFile: vi.fn(),
  getPackageManagerVersion: vi.fn(),
}))

/** CLI 自身 package.json 的固定元数据，用例可按需覆盖。 */
const context = {
  'version': '1.0.0',
  'engines': { node: '^20.19.0 || >=22.12.0' },
  'plume-deps': {
    'vuepress': '2.0.0',
    'http-server': '14.0.0',
    'vue': '3.5.0',
    'typescript': '5.0.0',
    'yarn': '1.22.19',
  },
}

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
  beforeEach(() => {
    vi.mocked(readJsonFile).mockResolvedValue(structuredClone(context))
    vi.mocked(getPackageManagerVersion).mockResolvedValue(null)
    vi.mocked(spawn).mockResolvedValue({ output: 'tester' } as any)
  })

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

  it('should throw an explicit error when the CLI package.json cannot be read', async () => {
    vi.mocked(readJsonFile).mockResolvedValue(null)

    // 缺少 CLI 自身的 package.json 时应在读取阶段失败，而不是后续出现 TypeError。
    await expect(createPackageJson(Mode.create, {}, base))
      .rejects
      .toThrow(/package\.json/)
  })

  it('should pin pnpm 10 and whitelist build scripts', async () => {
    vi.mocked(getPackageManagerVersion).mockResolvedValue('10.15.0')

    const file = await createPackageJson(Mode.create, {}, { ...base, packageManager: 'pnpm' })
    const json = JSON.parse(file.content)

    expect(json.packageManager).toBe('pnpm@10.15.0')
    // pnpm 10 从 package.json#pnpm 读取构建脚本白名单。
    expect(json.pnpm).toEqual({ onlyBuiltDependencies: ['@parcel/watcher'] })
    expect(json.scripts['vp-update']).toBe('pnpm dlx vp-update')
  })

  it('should not write the pnpm field on pnpm 11 and above', async () => {
    vi.mocked(getPackageManagerVersion).mockResolvedValue('11.0.0')

    const file = await createPackageJson(Mode.create, {}, { ...base, packageManager: 'pnpm' })
    const json = JSON.parse(file.content)

    expect(json.packageManager).toBe('pnpm@11.0.0')
    // pnpm 11+ 只从 pnpm-workspace.yaml 的 allowBuilds 读取，不再写入 package.json。
    expect(json.pnpm).toBeUndefined()
  })

  it('should fall back to the bundled yarn version for yarn 1', async () => {
    vi.mocked(getPackageManagerVersion).mockResolvedValue('1.22.10')

    const file = await createPackageJson(Mode.create, {}, { ...base, packageManager: 'yarn' })
    const json = JSON.parse(file.content)

    // yarn 1 的版本可能被镜像代理改写，使用 CLI 内置的版本。
    expect(json.packageManager).toBe('yarn@1.22.19')
    expect(json.scripts['vp-update']).toBe('yarn dlx vp-update')
  })

  it('should skip packageManager when the version cannot be detected', async () => {
    vi.mocked(getPackageManagerVersion).mockResolvedValue(null)

    const file = await createPackageJson(Mode.create, {}, { ...base, packageManager: 'pnpm' })
    const json = JSON.parse(file.content)

    expect(json.packageManager).toBeUndefined()
  })

  it('should set the author from git config including the email', async () => {
    vi.mocked(spawn).mockImplementation((async (_cmd: string, args?: string[]) => {
      if (args?.[2] === 'user.email')
        return { output: 'tester@example.com' } as any
      return { output: 'tester' } as any
    }) as typeof spawn)

    const file = await createPackageJson(Mode.create, {}, base)
    const json = JSON.parse(file.content)

    expect(json.author).toBe('tester <tester@example.com>')
  })

  it('should omit the email when git config has none', async () => {
    vi.mocked(spawn).mockImplementation((async (_cmd: string, args?: string[]) => {
      if (args?.[2] === 'user.email')
        return { output: '' } as any
      return { output: 'tester' } as any
    }) as typeof spawn)

    const file = await createPackageJson(Mode.create, {}, base)
    const json = JSON.parse(file.content)

    expect(json.author).toBe('tester')
  })

  it('should omit the author when git config is unavailable', async () => {
    vi.mocked(spawn).mockRejectedValue(new Error('git not found'))

    const file = await createPackageJson(Mode.create, {}, base)
    const json = JSON.parse(file.content)

    expect(json.author).toBeUndefined()
  })

  it('should omit engines when the CLI declares none', async () => {
    const { engines: _engines, ...withoutEngines } = structuredClone(context)
    vi.mocked(readJsonFile).mockResolvedValue(withoutEngines)

    const file = await createPackageJson(Mode.create, {}, base)
    const json = JSON.parse(file.content)

    expect(json.engines).toBeUndefined()
  })

  it('should keep a user declared vue dependency', async () => {
    const pkg = { dependencies: { vue: '^3.4.0' } }

    const file = await createPackageJson(Mode.init, pkg, base)
    const json = JSON.parse(file.content)

    // 用户已声明 vue 时不应被 CLI 的默认版本覆盖。
    expect(json.dependencies.vue).toBe('^3.4.0')
    expect(json.devDependencies.vue).toBeUndefined()
  })
})
