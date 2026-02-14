import crypto from 'node:crypto'
import { bcrypt } from 'hash-wasm'

/**
 * Generate encrypted password using bcrypt
 * Creates a secure hash with random salt for password storage
 *
 * 使用 bcrypt 生成加密密码
 * 使用随机盐创建安全的哈希值用于密码存储
 *
 * @param password - Plain text password to encrypt / 要加密的明文密码
 * @returns Bcrypt hashed password / Bcrypt 哈希后的密码
 */
export async function genEncrypt(password: string): Promise<string> {
  const salt = new Uint8Array(16)
  crypto.getRandomValues(salt)
  return await bcrypt({
    password: String(password),
    salt,
    costFactor: 11,
    outputType: 'encoded',
  })
}
