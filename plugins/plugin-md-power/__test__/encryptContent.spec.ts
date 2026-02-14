import { describe, expect, it } from 'vitest'
import { encryptContent } from '../src/node/utils/encryptContent.js'

describe('encryptContent', () => {
  it('should encrypt content with valid options', async () => {
    const content = 'Hello, World!'
    const password = 'test-password'
    const iv = new Uint8Array(16)
    const salt = new Uint8Array(16)

    const encrypted = await encryptContent(content, { password, iv, salt })

    expect(typeof encrypted).toBe('string')
    expect(encrypted.length).toBeGreaterThan(0)
    expect(encrypted).not.toBe(content)
  })

  it('should produce different encrypted content for different passwords', async () => {
    const content = 'Same content'
    const iv = new Uint8Array(16)
    const salt = new Uint8Array(16)

    const encrypted1 = await encryptContent(content, { password: 'password1', iv, salt })
    const encrypted2 = await encryptContent(content, { password: 'password2', iv, salt })

    expect(encrypted1).not.toBe(encrypted2)
  })

  it('should produce different encrypted content for different IVs', async () => {
    const content = 'Same content'
    const password = 'same-password'
    const salt = new Uint8Array(16)

    const iv1 = new Uint8Array(16).fill(1)
    const iv2 = new Uint8Array(16).fill(2)

    const encrypted1 = await encryptContent(content, { password, iv: iv1, salt })
    const encrypted2 = await encryptContent(content, { password, iv: iv2, salt })

    expect(encrypted1).not.toBe(encrypted2)
  })

  it('should produce different encrypted content for different salts', async () => {
    const content = 'Same content'
    const password = 'same-password'
    const iv = new Uint8Array(16)

    const salt1 = new Uint8Array(16).fill(1)
    const salt2 = new Uint8Array(16).fill(2)

    const encrypted1 = await encryptContent(content, { password, iv, salt: salt1 })
    const encrypted2 = await encryptContent(content, { password, iv, salt: salt2 })

    expect(encrypted1).not.toBe(encrypted2)
  })

  it('should encrypt empty string', async () => {
    const content = ''
    const password = 'test-password'
    const iv = new Uint8Array(16)
    const salt = new Uint8Array(16)

    const encrypted = await encryptContent(content, { password, iv, salt })

    expect(typeof encrypted).toBe('string')
  })

  it('should encrypt unicode content', async () => {
    const content = '你好，世界！🌍🎉'
    const password = 'test-password'
    const iv = new Uint8Array(16)
    const salt = new Uint8Array(16)

    const encrypted = await encryptContent(content, { password, iv, salt })

    expect(typeof encrypted).toBe('string')
    expect(encrypted.length).toBeGreaterThan(0)
  })

  it('should encrypt long content', async () => {
    const content = 'A'.repeat(10000)
    const password = 'test-password'
    const iv = new Uint8Array(16)
    const salt = new Uint8Array(16)

    const encrypted = await encryptContent(content, { password, iv, salt })

    expect(typeof encrypted).toBe('string')
    expect(encrypted.length).toBeGreaterThan(0)
  })

  it('should encrypt content with special characters', async () => {
    const content = '<script>alert("xss")</script>\n\t\r'
    const password = 'test-password'
    const iv = new Uint8Array(16)
    const salt = new Uint8Array(16)

    const encrypted = await encryptContent(content, { password, iv, salt })

    expect(typeof encrypted).toBe('string')
    expect(encrypted.length).toBeGreaterThan(0)
  })
})
