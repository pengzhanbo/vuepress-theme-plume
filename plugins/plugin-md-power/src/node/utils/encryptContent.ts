import { webcrypto } from 'node:crypto'

/**
 * Get key material from password
 *
 * 从密码获取密钥材料
 *
 * @see https://developer.mozilla.org/zh-CN/docs/Web/API/SubtleCrypto/deriveKey#pbkdf2_2
 * @param password - Password string / 密码字符串
 * @returns CryptoKey / 加密密钥
 */
function getKeyMaterial(password: string) {
  const enc = new TextEncoder()
  return webcrypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey'],
  )
}

/**
 * Get derived key from key material
 *
 * 从密钥材料获取派生密钥
 *
 * @param keyMaterial - Key material / 密钥材料
 * @param salt - Salt for key derivation / 密钥派生盐值
 * @returns Derived CryptoKey / 派生加密密钥
 */
function getCryptoDeriveKey(keyMaterial: CryptoKey | webcrypto.CryptoKey, salt: Uint8Array) {
  return webcrypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as unknown as ArrayBuffer,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    {
      name: 'AES-CBC',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt'],
  )
}

/**
 * Encrypt content using AES-CBC
 *
 * 使用 AES-CBC 加密内容
 *
 * @see https://github.com/mdn/dom-examples/blob/main/web-crypto/encrypt-decrypt/aes-cbc.js
 * @param content - Content to encrypt / 要加密的内容
 * @param options - Encryption options / 加密选项
 * @param options.password - Password for encryption / 加密密码
 * @param options.iv - Initialization vector / 初始化向量
 * @param options.salt - Salt for key derivation / 密钥派生盐值
 * @returns Encrypted content / 加密后的内容
 */
export async function encryptContent(content: string, options: {
  password: string
  iv: Uint8Array
  salt: Uint8Array
}) {
  const { password, iv, salt } = options
  const keyMaterial = await getKeyMaterial(password)
  const key = await getCryptoDeriveKey(keyMaterial, salt)

  const enc = new TextEncoder()
  const cipherTextData = await webcrypto.subtle.encrypt(
    {
      name: 'AES-CBC',
      iv: iv as unknown as ArrayBuffer,
    },
    key,
    enc.encode(content),
  )

  return String.fromCharCode(...new Uint8Array(cipherTextData))
}
