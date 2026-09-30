import type { App } from 'vuepress'
import type { MarkdownEnv } from 'vuepress/markdown'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { findFile } from '../src/node/demo/supports/file.js'
import { logger } from '../src/node/utils/logger.js'

// 测试在测试目录内创建临时文件。
// `.tmp` 目录已被 gitignore 忽略，并在测试结束后清理。
const TEST_TMP_DIR = fileURLToPath(new URL('.tmp', import.meta.url))

let baseDir: string
let sourceDir: string
let outsideDir: string
let app: App

function createApp(source: string): App {
  return {
    dir: {
      source: (...args: string[]) => path.resolve(source, ...args),
    },
  } as unknown as App
}

beforeAll(() => {
  fs.mkdirSync(TEST_TMP_DIR, { recursive: true })
  baseDir = fs.mkdtempSync(path.join(TEST_TMP_DIR, 'find-file-'))
  sourceDir = path.join(baseDir, 'source')
  outsideDir = path.join(baseDir, 'outside')
  fs.mkdirSync(path.join(sourceDir, 'guide'), { recursive: true })
  fs.mkdirSync(outsideDir, { recursive: true })
  fs.writeFileSync(path.join(sourceDir, 'guide', 'demo.md'), 'inside\n')
  fs.writeFileSync(path.join(outsideDir, 'secret.md'), 'secret\n')
  app = createApp(sourceDir)
})

afterAll(() => {
  fs.rmSync(TEST_TMP_DIR, { recursive: true, force: true })
})

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
})

describe('findFile > reject path traversal', () => {
  const spy = vi.spyOn(logger, 'warn').mockImplementation(() => {})

  afterAll(() => spy.mockRestore())

  it('should reject a relative path escaping the source directory', () => {
    expect(findFile(app, env('index.md'), '../outside/secret.md')).toBe('')
    expect(spy).toHaveBeenCalledWith(
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
