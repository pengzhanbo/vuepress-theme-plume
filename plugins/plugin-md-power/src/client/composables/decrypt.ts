import type { ComputedRef } from 'vue'

/**
 * Composable for decrypting encrypted content.
 *
 * 用于解密加密内容的组合式函数。
 *
 * This composable provides a decrypt function that uses the Web Crypto API
 * to decrypt content encrypted with AES-CBC algorithm.
 *
 * 该组合式函数提供一个解密函数，使用 Web Crypto API 解密使用 AES-CBC 算法加密的内容。
 *
 * @param config - Configuration containing salt and IV / 包含盐值和 IV 的配置
 * @returns Object with decrypt function / 包含解密函数的对象
 *
 * @example
 * ```ts
 * const config = computed(() => ({ salt: [...], iv: [...] }))
 * const { decrypt } = useDecrypt(config)
 * const content = await decrypt('password', 'encrypted-content')
 * ```
 */
export function useDecrypt(
  config: ComputedRef<{ salt: number[], iv: number[] }>,
) {
  /**
   * Convert number array to Uint8Array.
   *
   * 将数字数组转换为 Uint8Array。
   *
   * @param raw - Number array / 数字数组
   * @returns Uint8Array / Uint8Array
   */
  const toUnit8Array = (raw: number[]) => Uint8Array.from(raw)

  return {
    /**
     * Decrypt encrypted content using password.
     *
     * 使用密码解密加密内容。
     *
     * @param password - Decryption password / 解密密码
     * @param text - Encrypted content / 加密内容
     * @returns Decrypted content or undefined / 解密后的内容或 undefined
     */
    decrypt: async (password: string, text: string) => {
      if (!password)
        return

      const keyMaterial = await getKeyMaterial(password)
      const key = await getCryptoDeriveKey(keyMaterial, toUnit8Array(config.value.salt))

      const ciphertextData = Uint8Array.from(text, c => c.charCodeAt(0))

      const decrypted = await window.crypto.subtle.decrypt(
        {
          name: 'AES-CBC',
          iv: toUnit8Array(config.value.iv),
        },
        key,
        ciphertextData,
      )

      return new TextDecoder().decode(decrypted)
    },
  }
}

/**
 * Get key material from password using PBKDF2.
 *
 * 使用 PBKDF2 从密码获取密钥材料。
 *
 * @param password - Password string / 密码字符串
 * @returns CryptoKey for key derivation / 用于密钥派生的 CryptoKey
 */
function getKeyMaterial(password: string) {
  const enc = new TextEncoder()
  return window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey'],
  )
}

/**
 * Derive encryption key from key material using PBKDF2.
 *
 * 使用 PBKDF2 从密钥材料派生加密密钥。
 *
 * @param keyMaterial - Key material from password / 从密码获取的密钥材料
 * @param salt - Salt for key derivation / 密钥派生盐值
 * @returns Derived CryptoKey for AES-CBC / 用于 AES-CBC 的派生 CryptoKey
 */
function getCryptoDeriveKey(keyMaterial: CryptoKey, salt: BufferSource) {
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
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
