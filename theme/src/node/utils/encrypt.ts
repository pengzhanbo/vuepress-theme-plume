import crypto from 'node:crypto'
import { bcrypt } from 'hash-wasm'

export async function genEncrypt(password: string): Promise<string> {
  const salt = new Uint8Array(16)
  crypto.getRandomValues(salt)
  return await bcrypt({
    password,
    salt,
    costFactor: 11,
    outputType: 'encoded',
  })
}
