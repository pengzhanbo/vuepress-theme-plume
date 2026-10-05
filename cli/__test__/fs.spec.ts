import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { readFiles, readJsonFile, writeFiles } from '../src/utils/fs.js'

// 临时目录建立在项目测试目录内，而非系统临时目录。
// The temporary directory is created inside the project test directory,
// not in the system temporary directory.
const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '.__tmp_fs__')

describe('readFiles', () => {
  beforeEach(async () => {
    await fs.rm(dir, { recursive: true, force: true })
    await fs.mkdir(dir, { recursive: true })
  })

  afterEach(async () => {
    await fs.rm(dir, { recursive: true, force: true })
  })

  it('should read files recursively and skip directories', async () => {
    await fs.mkdir(path.join(dir, 'sub'), { recursive: true })
    await fs.writeFile(path.join(dir, 'a.txt'), 'A')
    await fs.writeFile(path.join(dir, 'sub', 'b.txt'), 'B')

    const files = await readFiles(dir)
    const map = new Map(files.map(file => [file.filepath, file.content]))

    expect(map.get('a.txt')).toBe('A')
    expect(map.get(path.join('sub', 'b.txt'))).toBe('B')
    // 目录本身不是文件，不应出现在结果中。
    expect(files.map(file => file.filepath)).not.toContain('sub')
  })
})

describe('readJsonFile', () => {
  beforeEach(async () => {
    await fs.rm(dir, { recursive: true, force: true })
    await fs.mkdir(dir, { recursive: true })
  })

  afterEach(async () => {
    await fs.rm(dir, { recursive: true, force: true })
  })

  it('should parse a valid json file', async () => {
    const file = path.join(dir, 'ok.json')
    await fs.writeFile(file, JSON.stringify({ a: 1 }))

    await expect(readJsonFile(file)).resolves.toEqual({ a: 1 })
  })

  it('should return null when the file does not exist', async () => {
    await expect(readJsonFile(path.join(dir, 'missing.json'))).resolves.toBeNull()
  })

  it('should return null when the content is not valid json', async () => {
    const file = path.join(dir, 'broken.json')
    await fs.writeFile(file, '{ not json')

    await expect(readJsonFile(file)).resolves.toBeNull()
  })
})

describe('writeFiles unexpected errors', () => {
  beforeEach(async () => {
    await fs.rm(dir, { recursive: true, force: true })
    await fs.mkdir(dir, { recursive: true })
  })

  afterEach(async () => {
    vi.restoreAllMocks()
    await fs.rm(dir, { recursive: true, force: true })
  })

  it('should rethrow errors that are not EEXIST', async () => {
    const error = Object.assign(new Error('permission denied'), { code: 'EACCES' })
    const spy = vi.spyOn(fs, 'open').mockRejectedValueOnce(error)

    await expect(
      writeFiles([{ filepath: 'a.txt', content: 'A' }], dir),
    ).rejects.toThrow('permission denied')

    // 非 EEXIST 错误不应被吞掉或误判为已跳过。
    expect(spy).toHaveBeenCalledTimes(1)
  })
})
