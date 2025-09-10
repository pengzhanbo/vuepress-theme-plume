import { random } from '@pengzhanbo/utils'
import { genSaltSync, hashSync } from 'bcrypt-ts'

export function genEncrypt(pwd: string): string {
  return hashSync(String(pwd), genSaltSync(random(8, 16)))
}
