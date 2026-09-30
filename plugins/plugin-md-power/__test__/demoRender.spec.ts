import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterAll, describe, expect, it, vi } from 'vitest'
import { compileCode } from '../src/node/demo/normal.js'
import { createDemoRender, waitDemoRender } from '../src/node/demo/watcher.js'
import { logger } from '../src/node/utils/logger.js'

// 测试在测试目录内创建临时文件。
// `.tmp` 目录已被 gitignore 忽略，并在测试结束后清理。
const TEST_TMP_DIR = fileURLToPath(new URL('.tmp', import.meta.url))

fs.mkdirSync(TEST_TMP_DIR, { recursive: true })
const tmpDir = fs.mkdtempSync(path.join(TEST_TMP_DIR, 'demo-render-'))

afterAll(() => {
  // 仅清理本文件创建的临时目录，避免影响其它测试文件（它们共用 `.tmp` 根目录）。
  fs.rmSync(tmpDir, { recursive: true, force: true })
})

describe('compileCode', () => {
  const spy = vi.spyOn(logger, 'error').mockImplementation(() => {})

  afterAll(() => spy.mockRestore())

  it('should write the compiled result', async () => {
    const output = path.join(tmpDir, 'basic.js')

    await compileCode({ jsType: 'js', cssType: 'css', html: '<div />' }, output)

    expect(fs.readFileSync(output, 'utf-8')).toContain('"<div />"')
    expect(spy).not.toHaveBeenCalled()
  })

  it('should release the pending render slot even when writing the output fails', async () => {
    createDemoRender()

    // `blocker` is a file, so it cannot be used as a parent directory and the write fails.
    const blocker = path.join(tmpDir, 'blocker')
    fs.writeFileSync(blocker, '')

    await expect(compileCode({ jsType: 'js', cssType: 'css' }, path.join(blocker, 'out.js')))
      .rejects
      .toThrow()

    // The render slot must be released in a `finally` block, otherwise this await
    // never settles and the build hangs in the `onPrepared` phase.
    await expect(waitDemoRender()).resolves.toBeUndefined()
    // the timeout guard should not be triggered
    expect(spy).not.toHaveBeenCalled()
  })
})
