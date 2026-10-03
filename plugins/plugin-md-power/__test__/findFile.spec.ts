import type { App } from 'vuepress'
import type { MarkdownEnv } from 'vuepress/markdown'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { findFile } from '../src/node/demo/supports/file.js'
import { logger } from '../src/node/utils/logger.js'

// 测试在测试目录内创建临时文件。
// `.tmp` 目录已被 gitignore 忽略，并在测试结束后清理。
const TEST_TMP_DIR = fileURLToPath(new URL('.tmp', import.meta.url))

fs.mkdirSync(TEST_TMP_DIR, { recursive: true })
const baseDir = fs.mkdtempSync(path.join(TEST_TMP_DIR, 'find-file-'))
const sourceDir = path.join(baseDir, 'source')
const outsideDir = path.join(baseDir, 'outside')
fs.mkdirSync(path.join(sourceDir, 'guide'), { recursive: true })
fs.mkdirSync(outsideDir, { recursive: true })
fs.writeFileSync(path.join(sourceDir, 'guide', 'demo.md'), 'inside\n')
fs.writeFileSync(path.join(outsideDir, 'secret.md'), 'secret\n')

const app = createApp(sourceDir)

// 静默并记录整个文件的警告输出，供各用例断言。
const warnSpy = vi.spyOn(logger, 'warn').mockImplementation(() => {})

beforeEach(() => warnSpy.mockClear())

// 部分平台（如 Windows 默认权限）无法创建符号链接，相关用例会被跳过。
let symlinkSupported = false
try {
  fs.symlinkSync(outsideDir, path.join(sourceDir, 'link-outside'), 'dir')
  fs.symlinkSync(path.join(sourceDir, 'guide'), path.join(sourceDir, 'link-inside'), 'dir')
  fs.symlinkSync(path.join(outsideDir, 'secret.md'), path.join(sourceDir, 'link-secret.md'))
  symlinkSupported = true
}
catch {
  symlinkSupported = false
}

afterAll(() => {
  warnSpy.mockRestore()
  // 仅清理本文件创建的临时目录，避免影响其它测试文件（它们共用 `.tmp` 根目录）。
  fs.rmSync(baseDir, { recursive: true, force: true })
})

function createApp(source: string): App {
  return {
    dir: {
      source: (...args: string[]) => path.resolve(source, ...args),
    },
  } as unknown as App
}

function env(filePathRelative: string): MarkdownEnv {
  return { filePath: path.join(sourceDir, filePathRelative), filePathRelative } as MarkdownEnv
}

describe('findFile > resolve inside source directory', () => {
  it('should resolve a relative path inside the source directory', () => {
    expect(findFile(app, env('guide/index.md'), './demo.md'))
      .toBe(path.join(sourceDir, 'guide', 'demo.md'))
  })

  it('should resolve an absolute path from the source root', () => {
    expect(findFile(app, env('guide/index.md'), '/guide/demo.md'))
      .toBe(path.join(sourceDir, 'guide', 'demo.md'))
  })

  it('should resolve the @source/ alias from the source root', () => {
    expect(findFile(app, env('guide/index.md'), '@source/guide/demo.md'))
      .toBe(path.join(sourceDir, 'guide', 'demo.md'))
  })

  it('should resolve the source directory itself', () => {
    expect(findFile(app, env('index.md'), '/')).toBe(sourceDir)
  })

  it('should allow a relative path that stays inside the source directory', () => {
    expect(findFile(app, env('guide/nested/index.md'), '../demo.md'))
      .toBe(path.join(sourceDir, 'guide', 'demo.md'))
  })

  it('should allow a path that does not exist yet', () => {
    expect(findFile(app, env('index.md'), './not-exists.md'))
      .toBe(path.join(sourceDir, 'not-exists.md'))
  })

  it('should fall back to the directory of filePath when filePathRelative is missing', () => {
    const missingRelative = { filePath: path.join(sourceDir, 'guide', 'index.md') } as MarkdownEnv
    expect(findFile(app, missingRelative, './demo.md'))
      .toBe(path.join(sourceDir, 'guide', 'demo.md'))
  })

  it('should fall back to the source root when no path is provided', () => {
    expect(findFile(app, {} as MarkdownEnv, './demo.md'))
      .toBe(path.join(sourceDir, 'demo.md'))
  })
})

describe('findFile > reject path traversal', () => {
  it('should reject a relative path escaping the source directory', () => {
    expect(findFile(app, env('index.md'), '../outside/secret.md')).toBe('')
    expect(warnSpy).toHaveBeenCalledWith(
      'resolve-file',
      expect.stringContaining('Refused to read a file outside the source directory'),
    )
  })

  it('should reject a normalized path escaping the source directory', () => {
    expect(findFile(app, env('guide/index.md'), './../../outside/secret.md')).toBe('')
  })

  it('should reject an absolute path escaping the source directory', () => {
    expect(findFile(app, env('index.md'), '/../outside/secret.md')).toBe('')
  })

  it('should reject the @source/ alias escaping the source directory', () => {
    expect(findFile(app, env('index.md'), '@source/../outside/secret.md')).toBe('')
  })
})

describe.skipIf(!symlinkSupported)('findFile > reject symlinks escaping the source directory', () => {
  it('should reject a directory symlink pointing outside the source directory', () => {
    expect(findFile(app, env('index.md'), '/link-outside/secret.md')).toBe('')
    expect(warnSpy).toHaveBeenCalledWith(
      'resolve-file',
      expect.stringContaining('Refused to read a file outside the source directory'),
    )
  })

  it('should reject the @source/ alias of a symlink pointing outside the source directory', () => {
    expect(findFile(app, env('index.md'), '@source/link-outside')).toBe('')
  })

  it('should reject a symlinked file pointing outside the source directory', () => {
    expect(findFile(app, env('index.md'), './link-secret.md')).toBe('')
  })

  it('should reject a non-existent file below a symlink pointing outside the source directory', () => {
    expect(findFile(app, env('index.md'), '/link-outside/not-exists.md')).toBe('')
  })

  it('should allow a symlink that stays inside the source directory', () => {
    expect(findFile(app, env('index.md'), '/link-inside/demo.md'))
      .toBe(path.join(sourceDir, 'link-inside', 'demo.md'))
  })
})
