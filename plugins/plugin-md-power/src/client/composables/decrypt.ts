import type { ComputedRef } from 'vue'

export function useDecrypt(
  config: ComputedRef<{ salt: number[], iv: number[] }>,
) {
  const toUnit8Array = (raw: number[]) => Uint8Array.from(raw)

  return {
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
 * crypto
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
