import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest'
import { compiler } from '../features/loadConfig/compiler.js'

// 测试在测试目录内创建临时文件。
// `.tmp` 目录已被 gitignore 忽略，并在测试结束后清理。
const TEST_TMP_DIR = fileURLToPath(new URL('.tmp', import.meta.url))
fs.mkdirSync(TEST_TMP_DIR, { recursive: true })
const tmpDir = fs.mkdtempSync(path.join(TEST_TMP_DIR, 'compiler-'))

beforeEach(() => {
  // 每个用例使用独立的文件，避免残留的生成产物相互影响。
  for (const file of fs.readdirSync(tmpDir))
    fs.rmSync(path.join(tmpDir, file), { force: true, recursive: true })
})

afterEach(() => {
  // `compiler` 把打包结果写到配置文件旁，导入后应立即删除。
  const leftovers = fs.readdirSync(tmpDir).filter(file => file.endsWith('.mjs'))
  expect(leftovers).toEqual([])
})

function writeFile(name: string, content: string): string {
  const filepath = path.join(tmpDir, name)
  fs.writeFileSync(filepath, content)
  return filepath
}

describe('compiler', () => {
  it('returns an empty config when no config file is provided', async () => {
    await expect(compiler()).resolves.toEqual({ config: {}, dependencies: [] })
  })

  it('bundles a local dependency and evaluates file-scope variables', async () => {
    const depPath = writeFile('dep.ts', 'export const depName = \'local-dependency\'\n')
    const configPath = writeFile('plume.config.ts', `import { depName } from './dep.js'

export default {
  title: depName,
  dirname: __dirname,
  metaDirname: import.meta.dirname,
  filename: __filename,
  metaFilename: import.meta.filename,
  url: import.meta.url,
}
`)

    const { config, dependencies } = await compiler(configPath)

    expect(config).toMatchObject({
      title: 'local-dependency',
      // 配置文件所在目录被注入到 `__dirname` / `import.meta.dirname`。
      dirname: tmpDir,
      metaDirname: tmpDir,
      filename: configPath,
      metaFilename: configPath,
      url: pathToFileURL(configPath).href,
    })
    // 本地依赖会被收集，用于 HMR 时监听配置的依赖变化。
    expect(dependencies).toContain(configPath)
    expect(dependencies).toContain(depPath)
  })

  it('externalizes bare imports instead of bundling them', async () => {
    const configPath = writeFile('external.config.ts', `import { basename } from 'node:path'

export default { base: basename(__filename) }
`)

    const { config, dependencies } = await compiler(configPath)

    expect(config).toMatchObject({ base: 'external.config.ts' })
    // 裸模块不会被当作配置依赖，否则每次依赖更新都会触发配置重载。
    expect(dependencies.some(file => file.includes('node:path'))).toBe(false)
    expect(dependencies).toContain(configPath)
  })

  it('rejects and cleans up when the config file cannot be evaluated', async () => {
    const configPath = writeFile('broken.ts', 'export default {\n')

    await expect(compiler(configPath)).rejects.toThrow()
  })

  it('rethrows errors thrown by the config module', async () => {
    const configPath = writeFile('throws.ts', 'export default (() => { throw new Error(\'boom\') })()\n')

    await expect(compiler(configPath)).rejects.toThrow('boom')
  })
})

afterAll(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true })
})
