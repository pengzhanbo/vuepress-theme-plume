import { describe, expect, it } from 'vitest'
import { genEncrypt } from '../src/node/utils/encrypt.js'

describe('genEncrypt', () => {
  it('produces a bcrypt encoded hash with a random salt', async () => {
    const hashed = await genEncrypt('my-password')

    // bcrypt 编码格式：$2x$<cost>$<salt+hash>
    expect(hashed).toMatch(/^\$2[aby]?\$\d{2}\$/)
    expect(hashed.length).toBeGreaterThan(50)
  }, 30_000)

  it('generates a different hash for the same password on each call', async () => {
    const first = await genEncrypt('same-password')
    const second = await genEncrypt('same-password')

    // 随机盐保证相同明文得到不同密文。
    expect(first).not.toBe(second)
  }, 30_000)

  it('stringifies non-string input before hashing', async () => {
    const hashed = await genEncrypt(123456 as unknown as string)

    expect(hashed).toMatch(/^\$2[aby]?\$\d{2}\$/)
  }, 30_000)
})
