import type { ResolvedData } from '../src/types.js'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { DeployType, Mode } from '../src/constants.js'

/**
 * `generate` 负责把模板、项目类型和部署配置组装成待写入的文件列表。这里只替换
 * 文件系统访问与 `package.json` 生成，保留真实的模板渲染（Eta），以验证 `.tpl`
 * 文件确实按站点数据渲染。
 *
 * `generate` assembles the file list from templates, mode and deployment. Only the
 * filesystem access and `package.json` generation are stubbed; the real template
 * renderer (Eta) is kept so that `.tpl` files are verified to be rendered.
 */
const hoisted = vi.hoisted(() => ({
  readFiles: vi.fn(),
  getTemplate: vi.fn((dir: string) => dir),
  readJsonFile: vi.fn(),
  writeFiles: vi.fn(),
  getPnpmMajorVersion: vi.fn(),
  createPackageJson: vi.fn(),
}))

vi.mock('../src/utils/index.js', () => ({
  readFiles: hoisted.readFiles,
  getTemplate: hoisted.getTemplate,
  readJsonFile: hoisted.readJsonFile,
  writeFiles: hoisted.writeFiles,
  getPnpmMajorVersion: hoisted.getPnpmMajorVersion,
}))

vi.mock('../src/packageJson.js', () => ({
  createPackageJson: hoisted.createPackageJson,
}))

const { generate } = await import('../src/generate.js')

const TEST_TMP_DIR = fileURLToPath(new URL('.__tmp_generate__', import.meta.url))
const tmpDir = path.join(TEST_TMP_DIR, 'project')
let restoreCwd: (() => void) | undefined

const baseData: ResolvedData = {
  displayLang: 'en-US',
  root: 'my-project',
  siteName: 'My Site',
  siteDescription: '',
  bundler: 'vite',
  multiLanguage: false,
  defaultLanguage: 'en-US',
  injectNpmScripts: true,
  deploy: DeployType.custom,
  git: false,
  install: false,
  packageManager: 'pnpm',
  docsDir: 'docs',
}

/** 每个模板目录对应的固定文件，测试按需覆盖。 */
function mockTemplates(files: Record<string, Array<{ filepath: string, content: string }>>) {
  hoisted.readFiles.mockImplementation(async (dir: string) => files[dir] ?? [])
}

function writtenFiles(): Array<{ filepath: string, content: string, overwrite?: boolean }> {
  return hoisted.writeFiles.mock.calls.at(-1)?.[0] ?? []
}

function findWritten(filepath: string) {
  return writtenFiles().find(file => file.filepath === filepath)
}

beforeEach(() => {
  fs.rmSync(TEST_TMP_DIR, { recursive: true, force: true })
  fs.mkdirSync(tmpDir, { recursive: true })
  restoreCwd = vi.spyOn(process, 'cwd').mockReturnValue(tmpDir)

  hoisted.readFiles.mockReset()
  hoisted.readJsonFile.mockReset()
  hoisted.writeFiles.mockReset().mockResolvedValue({ written: [], skipped: [] })
  hoisted.getPnpmMajorVersion.mockReset().mockResolvedValue(11)
  hoisted.createPackageJson.mockReset().mockResolvedValue({ filepath: 'package.json', content: '{}' })
})

afterEach(() => {
  restoreCwd?.()
  restoreCwd = undefined
  fs.rmSync(TEST_TMP_DIR, { recursive: true, force: true })
})

describe('generate > create mode', () => {
  it('renders templates and writes the docs, common and pnpm workspace files', async () => {
    mockTemplates({
      '.vuepress': [{ filepath: 'config.ts.tpl', content: 'export default { title: \'<%= it.siteName %>\' }' }],
      'docs/en': [{ filepath: 'index.md', content: '# Home' }],
      'common': [{ filepath: 'README.md', content: '# Readme' }],
    })

    await generate(Mode.create, { ...baseData }, { force: true })

    expect(hoisted.createPackageJson).toHaveBeenCalledWith(Mode.create, {}, baseData)
    // `create` 模式写入仓库根目录，模板内容被渲染。
    expect(hoisted.writeFiles).toHaveBeenCalledWith(expect.any(Array), path.join(tmpDir, 'my-project'), true)

    expect(findWritten('docs/.vuepress/config.ts.tpl')?.content)
      .toBe('export default { title: \'My Site\' }')
    expect(findWritten('docs/index.md')).toMatchObject({ content: '# Home' })
    expect(findWritten('README.md')).toMatchObject({ content: '# Readme' })
    expect(findWritten('package.json')).toMatchObject({ content: '{}' })

    // pnpm 11+ 的构建脚本白名单写入 `pnpm-workspace.yaml`。
    expect(findWritten('pnpm-workspace.yaml')?.content).toContain('allowBuilds:')
    expect(findWritten('pnpm-workspace.yaml')?.content).toContain('\'@parcel/watcher\': true')
  })

  it('omits the pnpm build allowlist for older pnpm versions', async () => {
    mockTemplates({})
    hoisted.getPnpmMajorVersion.mockResolvedValue(10)

    await generate(Mode.create, { ...baseData })

    expect(findWritten('pnpm-workspace.yaml')?.content).toBe('shamefullyHoist: true\nshellEmulator: true\n')
  })

  it('writes the yarn nodeLinker config and the deployment templates', async () => {
    mockTemplates({
      'deploy/github': [{ filepath: '.github/workflows/deploy.yml', content: 'deploy' }],
    })

    await generate(Mode.create, {
      ...baseData,
      packageManager: 'yarn',
      deploy: DeployType.github,
    })

    expect(findWritten('.yarnrc.yml')?.content).toBe('nodeLinker: \'node-modules\'\n')
    expect(findWritten('.github/workflows/deploy.yml')).toMatchObject({ content: 'deploy' })
    // yarn 不写入 pnpm workspace。
    expect(findWritten('pnpm-workspace.yaml')).toBeUndefined()
  })

  it('places the secondary language docs in a subdirectory', async () => {
    mockTemplates({
      'docs/zh': [{ filepath: 'index.md', content: 'zh' }],
      'docs/en': [{ filepath: 'index.md', content: 'en' }],
    })

    await generate(Mode.create, {
      ...baseData,
      multiLanguage: true,
      defaultLanguage: 'zh-CN',
    })

    expect(findWritten('docs/index.md')).toMatchObject({ content: 'zh' })
    expect(findWritten('docs/en/index.md')).toMatchObject({ content: 'en' })
  })
})

describe('generate > init mode', () => {
  it('merges the existing package.json and gitignore instead of replacing them', async () => {
    fs.writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify({ name: 'existing' }))
    // CRLF 项目不应被混入 LF 行。
    fs.writeFileSync(path.join(tmpDir, '.gitignore'), 'node_modules\r\n')
    hoisted.readJsonFile.mockResolvedValue({ name: 'existing' })
    mockTemplates({
      git: [
        { filepath: '.gitignore', content: 'ignored' },
        { filepath: '.github/workflows/deploy.yml', content: 'deploy' },
      ],
    })

    await generate(Mode.init, { ...baseData, root: '.', git: true })

    expect(hoisted.createPackageJson).toHaveBeenCalledWith(Mode.init, { name: 'existing' }, expect.anything())
    // `init` 模式写入用户选择的目录本身，而不是新建工程目录。
    expect(hoisted.writeFiles).toHaveBeenCalledWith(expect.any(Array), tmpDir, undefined)

    const gitignore = findWritten('.gitignore')
    expect(gitignore).toMatchObject({ filepath: '.gitignore', overwrite: true })
    expect(gitignore!.content).toContain('node_modules\r\n')
    expect(gitignore!.content).toContain('.vuepress/dist\r\n')
    // 原有的 `.gitignore` 被合并，不再写入模板中的同名文件。
    expect(gitignore!.content).not.toContain('ignored')

    expect(findWritten('.github/workflows/deploy.yml')).toBeDefined()
  })

  it('uses the git template as-is when the user has no gitignore', async () => {
    mockTemplates({
      git: [{ filepath: '.gitignore', content: 'created-by-template' }],
    })

    await generate(Mode.init, { ...baseData, git: true })

    expect(findWritten('.gitignore')?.content).toBe('created-by-template')
    expect(findWritten('.gitignore')?.overwrite).toBeUndefined()
  })
})
