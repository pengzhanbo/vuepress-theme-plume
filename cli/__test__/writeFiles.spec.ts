import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { writeFiles } from '../src/utils/fs.js'

// 临时目录建立在项目测试目录内，而非系统临时目录。
// The temporary directory is created inside the project test directory,
// not in the system temporary directory.
const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '.__tmp_writeFiles__')

describe('writeFiles conflict protection', () => {
  beforeEach(async () => {
    await fs.rm(dir, { recursive: true, force: true })
    await fs.mkdir(dir, { recursive: true })
  })

  afterEach(async () => {
    await fs.rm(dir, { recursive: true, force: true })
  })

  it('should write new files and strip the .tpl extension', async () => {
    const res = await writeFiles([{ filepath: 'a.txt.tpl', content: 'A' }], dir)

    expect(res.written).toEqual([path.join(dir, 'a.txt')])
    expect(res.skipped).toEqual([])
    expect(await fs.readFile(path.join(dir, 'a.txt'), 'utf-8')).toBe('A')
  })

  it('should create missing parent directories', async () => {
    await writeFiles([{ filepath: 'docs/.vuepress/config.ts', content: 'config' }], dir)

    expect(await fs.readFile(path.join(dir, 'docs/.vuepress/config.ts'), 'utf-8')).toBe('config')
  })

  it('should skip existing files by default', async () => {
    await fs.writeFile(path.join(dir, 'a.txt'), 'OLD')

    const res = await writeFiles([{ filepath: 'a.txt', content: 'NEW' }], dir)

    expect(res.written).toEqual([])
    expect(res.skipped).toEqual([path.join(dir, 'a.txt')])
    expect(await fs.readFile(path.join(dir, 'a.txt'), 'utf-8')).toBe('OLD')
  })

  it('should overwrite existing files when force is enabled', async () => {
    await fs.writeFile(path.join(dir, 'a.txt'), 'OLD')

    const res = await writeFiles([{ filepath: 'a.txt', content: 'NEW' }], dir, true)

    expect(res.written).toEqual([path.join(dir, 'a.txt')])
    expect(res.skipped).toEqual([])
    expect(await fs.readFile(path.join(dir, 'a.txt'), 'utf-8')).toBe('NEW')
  })

  it('should overwrite when a single file is marked as overwrite', async () => {
    await fs.writeFile(path.join(dir, 'package.json'), 'OLD')

    const res = await writeFiles([{ filepath: 'package.json', content: 'NEW', overwrite: true }], dir)

    expect(res.written).toEqual([path.join(dir, 'package.json')])
    expect(res.skipped).toEqual([])
    expect(await fs.readFile(path.join(dir, 'package.json'), 'utf-8')).toBe('NEW')
  })

  it('should not overwrite when concurrent writes race on the same file', async () => {
    const files = [{ filepath: 'race.txt', content: 'RACE' }]

    const [first, second] = await Promise.all([
      writeFiles(files, dir),
      writeFiles(files, dir),
    ])

    // 排他创建保证只有一个实例写入，另一个实例跳过。
    // Exclusive create guarantees only one writer wins, the other skips.
    expect(first.written.length + second.written.length).toBe(1)
    expect(first.skipped.length + second.skipped.length).toBe(1)
    expect(await fs.readFile(path.join(dir, 'race.txt'), 'utf-8')).toBe('RACE')
  })

  it('should keep untouched files when only some conflicts exist', async () => {
    await fs.writeFile(path.join(dir, 'a.txt'), 'OLD')

    const res = await writeFiles([
      { filepath: 'a.txt', content: 'NEW' },
      { filepath: 'b.txt', content: 'B' },
    ], dir)

    expect(res.skipped).toEqual([path.join(dir, 'a.txt')])
    expect(res.written).toEqual([path.join(dir, 'b.txt')])
    expect(await fs.readFile(path.join(dir, 'a.txt'), 'utf-8')).toBe('OLD')
    expect(await fs.readFile(path.join(dir, 'b.txt'), 'utf-8')).toBe('B')
  })
})
