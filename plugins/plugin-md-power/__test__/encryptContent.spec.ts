import { describe, expect, it } from 'vitest'
import { encryptContent } from '../src/node/utils/encryptContent.js'

/**
 * 复刻客户端 `useDecrypt` 的解密过程，用于断言密文能在客户端被还原。
 *
 * 同时固定了两端的契约：密文中每个字符码对应一个字节。
 *
 * Mirrors the client `useDecrypt` flow so the ciphertext is asserted to be
 * restorable on the client. It also pins the contract shared by both ends: one
 * code unit per byte.
 */
async function decryptContent(
  text: string,
  password: string,
  iv: BufferSource,
  salt: BufferSource,
): Promise<string> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey'],
  )
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-CBC', length: 256 },
    true,
    ['encrypt', 'decrypt'],
  )

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-CBC', iv },
    key,
    Uint8Array.from(text, c => c.charCodeAt(0)),
  )

  return new TextDecoder().decode(decrypted)
}

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

  it('should encrypt content larger than the spread argument limit', async () => {
    // 回归：`String.fromCharCode(...bytes)` 会把每个字节作为实参，密文超过 V8 的
    // 实参数量上限（约 10 万）时抛出 `Maximum call stack size exceeded`，
    // 使较大的 `::: encrypt` 片段中断整个构建。
    // Regression: `String.fromCharCode(...bytes)` passes every byte as an argument,
    // so a ciphertext beyond V8's argument limit (~100k) threw
    // `Maximum call stack size exceeded`, aborting the build for a large snippet.
    const content = 'A'.repeat(200_000)
    const password = 'test-password'
    const iv = new Uint8Array(16).fill(1)
    const salt = new Uint8Array(16).fill(2)

    const encrypted = await encryptContent(content, { password, iv, salt })

    // AES-CBC 的填充会让密文长度为明文长度加上一个 16 字节块，
    // 即「每个字符码对应一个字节」的契约仍然成立。
    expect(encrypted.length).toBe(content.length + 16)
    // 大内容同样能被客户端还原。
    expect(await decryptContent(encrypted, password, iv, salt)).toBe(content)
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
